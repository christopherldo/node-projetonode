exports.userMiddleware = (req, res, next) => {
  let info = {
    id: 1,
    public_id: '114a7df2-cb92-4c88-b945-35ae274ce265',
    name: 'Christopher'
  };

  req.userInfo = info;

  next();
};

exports.index = (req, res) => {
  let obj = {
    pageTitle: 'Home',
    userInfo: req.userInfo,
  };

  res.render('home', obj);
};