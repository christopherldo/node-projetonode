const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require('../handlers/mailHandler');
const validator = require('validator');

exports.login = (req, res) => {
  res.render('login', {
    pageTitle: 'Login'
  });
};

exports.loginAction = (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  if (validator.isEmail(data.email) === false) {
    req.flash('error', 'O e-mail enviado não é um e-mail válido.');
    res.redirect('back');
    return;
  };

  const auth = User.authenticate();

  auth(data.email, data.password, (error, result) => {
    if (result === false) {
      req.flash('error', 'E-mail e/ou senha inválidos.');
      res.redirect('/users/login');
      return;
    };

    req.login(result, () => {});

    req.flash('success', 'Usuário logado com sucesso!');
    res.redirect('/');
  });
};

exports.register = (req, res) => {
  res.render('register', {
    pageTitle: 'Registrar'
  });
};

exports.registerAction = (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    password_confirmation: req.body.password_confirmation,
  };

  if (validator.isLength(data.name, {
      min: 2,
      max: 50,
    }) === false) {
    req.flash('error', 'O nome precisa conter de 2 a 50 caracteres');
    res.redirect('back');
    return;
  };

  if (validator.isEmail(data.email) === false) {
    req.flash('error', 'O e-mail enviado não é um e-mail válido.');
    res.redirect('back');
    return;
  };

  if (validator.isLength(data.email, {
      max: 50
    }) === false) {
    req.flash('error', 'O e-mail não pode ultrapassar o limite de 50 caracteres');
    res.redirect('back');
    return;
  };

  if (validator.isLength(data.password, {
      min: 8
    }) === false) {
    req.flash('error', 'Sua senha precisa conter pelo menos 8 caracteres');
    res.redirect('back');
    return;
  };

  if (validator.equals(data.password, data.password_confirmation) === false) {
    req.flash('error', 'A senha e a confirmação não são idênticas');
    res.redirect('back');
    return;
  };

  const newUser = new User(data);

  User.register(newUser, data.password, (err) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/users/register');
      return;
    };

    req.flash('success', 'Registro efetuado com sucesso, faça login!')
    res.redirect('/users/login');
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

exports.profile = (req, res) => {
  res.render('profile', {
    pageTitle: 'Meu Perfil',
  });
};

exports.profileAction = async (req, res) => {
  const data = {};

  if (req.body.name) {
    data.name = req.body.name;

    if (validator.isLength(data.name, {
        min: 2,
        max: 50,
      }) === false) {
      req.flash('error', 'O nome precisa conter de 2 a 50 caracteres');
      res.redirect('back');
      return;
    };
  };

  if (req.body.email) {
    data.email = req.body.email;

    if (validator.isEmail(data.email) === false) {
      req.flash('error', 'O e-mail enviado não é um e-mail válido.');
      res.redirect('back');
      return;
    };

    if (validator.isLength(data.email, {
        max: 50
      }) === false) {
      req.flash('error', 'O e-mail não pode ultrapassar o limite de 50 caracteres');
      res.redirect('back');
      return;
    };
  };

  try {
    await User.findOneAndUpdate({
      _id: req.user._id
    }, data, {
      new: true,
      runValidators: true
    });
  } catch (error) {
    req.flash('error', `Ocorreu um erro: ${error.message}`);
    res.redirect('/profile');
    return;
  };

  req.flash('success', 'Dados atualizados com sucesso!');
  res.redirect('/profile');
};

exports.forgotPassword = (req, res) => {
  res.render('forgotPassword', {
    pageTitle: 'Recuperação de senha'
  });
};

exports.forgotPasswordAction = async (req, res) => {
  const data = req.body;

  if (validator.isEmail(data.email) === false) {
    req.flash('error', 'O e-mail enviado não é um e-mail válido.');
    res.redirect('back');
    return;
  };

  if (validator.isLength(data.email, {
      max: 50
    }) === false) {
    req.flash('error', 'O e-mail não pode ultrapassar o limite de 50 caracteres');
    res.redirect('back');
    return;
  };

  const user = await User.findOne({
    email: data.email
  }).exec();

  if (user === null) {
    req.flash('error', `Não foi encontrado o e-mail "${data.email}" nos nossos sistemas`);
    res.redirect('/users/forgot-password');
    return;
  };

  let date = new Date();
  date.setHours(date.getHours() + 24);

  user.resetPasswordToken = crypto.randomBytes(64).toString('hex');
  user.resetPasswordExpires = date;

  await user.save();

  const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

  const to = `${user.name} <${user.email}>`;
  const subject = 'Redefina sua senha';
  const html = `Testando e-mail com link: <a href="${resetLink}">Clique aqui para redefinir sua senha.</a>`;
  const text = `Testando e-mail com link: ${resetLink}`;

  mailHandler.send({
    to,
    subject,
    html,
    text,
  });

  req.flash('success', `Enviamos um e-mail de redefinição para ${data.email}, favor checar também a caixa de spam`);
  res.redirect('/users/login');
};

exports.forgotPasswordToken = async (req, res) => {
  const data = req.params;

  const user = await User.findOne({
    resetPasswordToken: data.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).exec();

  if (user === null) {
    req.flash('error', 'O token enviado não é um token válido');
    res.redirect('/users/forgot-password');
    return;
  };

  res.render('resetPassword', {
    pageTitle: 'Redefina a senha'
  });
};

exports.forgotPasswordTokenAction = async (req, res) => {
  const data = req.body;

  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).exec();

  if (user === null) {
    req.flash('error', 'O token enviado não é um token válido');
    res.redirect('/users/forgot-password');
    return;
  };

  if (data.password !== data.password_confirmation) {
    req.flash('error', 'As senhas não coincidem');
    res.redirect(`back`);
    return;
  };

  user.setPassword(data.password, async () => {
    user.resetPasswordExpires = null;
    user.resetPasswordToken = null;

    await user.save();

    req.flash('success', 'Senha alterada com sucesso!');
    res.redirect('/users/login');
  });
};