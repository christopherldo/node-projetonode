const moongose = require('mongoose');
const Post = moongose.model('Post');
const uuid = require('uuidv4');

exports.add = (req, res) => {
  res.render('postAdd');
};

exports.addAction = async (req, res) => {
  let data = req.body;

  const post = new Post();

  post.public_id = uuid.uuid();
  post.title = data.title;
  post.body = data.body;
  post.tags = [];

  await post.save();

  req.flash('success', 'Post salvo com sucesso!');

  res.redirect('/');
};