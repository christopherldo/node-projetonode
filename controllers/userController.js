const User = require('../models/User');

exports.login = (req, res) => {
  res.render('login', {
    pageTitle: 'Login'
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
    if(err){
      req.flash('error', JSON.stringify(err));
      console.log('Erro ao registrar: ' + err);
      res.redirect('/users/register');
      return;
    };

    req.flash('success', 'Registro efetuado com sucesso, faça login!')
    res.redirect('/users/login');
  });
  
};