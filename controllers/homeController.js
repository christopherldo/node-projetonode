exports.index = (req, res) => {
  let obj = {
    pageTitle: 'Home',
    userInfo: req.userInfo,
  };

  res.render('home', obj);
};