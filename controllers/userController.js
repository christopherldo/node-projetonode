exports.login = (req, res) => {
  res.render('login', {
    pageTitle: 'Login'
  });
};

exports.register = (req, res) => {
  res.render('register', {
    pageTitle: 'Registrar'
  });
}