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

  if (data.password !== data.password_confirmation) {
    req.flash('error', 'As senhas não coincidem');
    res.redirect('/profile');
    return;
  };

  req.user.setPassword(data.password, async () => {
    await req.user.save();

    req.flash('success', 'Senha alterada com sucesso!');
    res.redirect('/');
  });
};