const moongose = require('mongoose');
const slug = require('slug');
const uuid = require('uuid');
const fs = require('fs');
const Post = moongose.model('Post');

exports.add = (req, res) => {
  res.render('postAdd', {
    pageTitle: 'Adicionar Post'
  });
};

exports.addAction = async (req, res) => {
  req.body.author = req.user._id;

  let data = req.body;

  const post = new Post();

  let id = null;

  if (data.photo) {
    let isUuid = uuid.validate(data.photo.split('.')[0]);

    if (isUuid) {
      id = data.photo.split('.')[0];
      post.photo = data.photo;
    };
  };

  post.public_id = id ? id : uuid.v4();
  post.title = data.title;
  post.body = data.body;
  post.author = data.author;

  if (req.body.tags === '') {
    post.tags = [];
  } else {
    post.tags = data.tags.split(',').map(tag => tag.trim());
  };

  try {
    await post.save();
  } catch (error) {
    req.flash('error', `Ocorreu um erro, tente novamente.`);

    if (post.photo) {
      fs.unlinkSync(`./public/uploads/${post.photo}`);
    };

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
    post,
    pageTitle: 'Editar'
  });
};

exports.editAction = async (req, res) => {
  const data = {
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags.split(',').map(tag => tag.trim()),
    photo: req.body.photo,
  };

  if (req.body.tags === '') {
    data.tags = [];
  };

  const previousSlug = req.params.slug;

  let titleSlug = slug(data.title, {
    lower: true,
  });

  data.slug = titleSlug;

  if (previousSlug !== titleSlug) {
    let formattedSlug = previousSlug.split('--');

    if (typeof (formattedSlug === 'object') && formattedSlug[0] === titleSlug) {
      data.slug = previousSlug;
    } else {
      data.slug_count = 1;

      const slugRegex = new RegExp(`^(${titleSlug})((--[0-9]{1,})?)$`);

      const postsWithSlug = await Post.find({
        slug: slugRegex
      }).sort({
        slug_count: -1
      }).limit(1);

      if (postsWithSlug.length === 1) {
        data.slug_count = postsWithSlug[0].slug_count + 1;
        data.slug = `${data.slug}--${data.slug_count}`;
      };
    };
  };

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
    post,
    pageTitle: post.title
  });
};