module.exports.isLogged = (req, res, next) => {
  if(req.isAuthenticated() === false){
    req.flash('error', 'Você não tem permissão para acessar essa página!')
    res.redirect('/users/login');
    return;
  };

  next();
};

module.exports.isGuest = (req, res, next) => {
  if(req.isAuthenticated()){
    res.redirect('/');
    return;
  };

  next();
};