exports.index = (req, res) => {
  let obj = {
    pageTitle: 'Home',
  };

  res.render('home', obj);
};