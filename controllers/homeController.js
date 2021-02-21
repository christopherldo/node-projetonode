const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (req, res) => {
  let response = {
    pageTitle: 'Home',
    posts: [],
    tags: [],
    tag: ''
  };

  response.tag = req.query.tag;

  const postFilter = (response.tag) ? {
    tags: response.tag
  } : {};

  const tagsPromise = Post.getTagsList();
  const postsPromise = Post.find(postFilter);

  const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);

  for (let tag in tags) {
    if (tags[tag]._id === response.tag) {
      tags[tag].class = 'selected';
    };
  };

  response.tags = tags;
  response.posts = posts;

  res.render('home', response);
};