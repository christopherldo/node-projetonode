const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (req, res) => {
  let response = {
    pageTitle: 'Home',
    posts: {},
  };

  const posts = await Post.find();
  response.posts = posts;

  res.render('home', response);
};