const User = require('../models/User');

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
  };

  const newUser = new User(data);

  User.register(newUser, data.password, (err) => {
    if (err) {
      req.flash('error', JSON.stringify(err));
      console.log('Erro ao registrar: ' + err);
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