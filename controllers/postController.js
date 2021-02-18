const moongose = require('mongoose');
const slug = require('slug');
const {
  empty
} = require('uuidv4');
const Post = moongose.model('Post');

exports.add = (req, res) => {
  res.render('postAdd');
};

exports.addAction = async (req, res) => {
  let data = req.body;

  const post = new Post();

  post.title = data.title;
  post.body = data.body;
  post.tags = data.tags.split(',').map(tag => tag.trim());

  try {
    await post.save();
  } catch (error) {
    req.flash('error', `Ocorreu um erro, tente novamente.`);
    return res.redirect('/post/add');
  };

  req.flash('success', 'Post salvo com sucesso!');

  res.redirect('/');
};

exports.edit = async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
  });

  res.render('postEdit', {
    post
  });
};

exports.editAction = async (req, res) => {
  const data = {
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags.split(',').map(tag => tag.trim()),
  };

  if (req.body.tags === '') {
    data.tags = [];
  };

  data.slug = slug(req.body.title, {
    lower: true,
  });

  try {
    const post = await Post.findOneAndUpdate({
      slug: req.params.slug,
    }, data, {
      new: true,
      runValidators: true,
    });

    req.flash('success', 'Post atualizado com sucesso!');

    res.redirect('/');
  } catch (error) {
    req.flash('error', `Ocorreu um erro, tente novamente.`);

    res.redirect(`/post/${req.params.slug}/edit`);
  };
};

exports.view = async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
  });

  res.render('view', {
    post
  });
};