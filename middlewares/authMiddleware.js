const validator = require('validator');

exports.isLogged = (req, res, next) => {
  if (req.isAuthenticated() === false) {
    req.flash('error', 'Você não tem permissão para acessar essa página!')
    res.redirect('/users/login');
    return;
  };

  next();
};

exports.isGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
    return;
  };

  next();
};

exports.changePassword = (req, res) => {
  const data = req.body;

  if (validator.isLength(data.password, {
      min: 8
    }) === false) {
    req.flash('error', 'Sua senha precisa conter pelo menos 8 caracteres');
    res.redirect('back');
    return;
  };

  if (validator.equals(data.password, data.password_confirmation) === false) {
    req.flash('error', 'As senhas informadas não coincidem');
    res.redirect('back');
    return;
  };

  req.user.setPassword(data.password, async () => {
    await req.user.save();

    req.flash('success', 'Senha alterada com sucesso!');
    res.redirect('/');
  });
};