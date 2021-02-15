const moongose = require('mongoose');
const Post = moongose.model('Post');
const {uuid} = require('uuidv4');

exports.add = (req, res) => {
  res.render('postAdd');
};

exports.addAction = async (req, res) => {
  let data = req.body;

  const post = new Post();
  post._id = uuid();
  post.title = data.title;
  await post.save();

  res.redirect('/');
};