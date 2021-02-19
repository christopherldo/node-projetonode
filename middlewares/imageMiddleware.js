const multer = require('multer');
const jimp = require('jimp');
const moongose = require('mongoose');
const Post = moongose.model('Post');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
      next(null, true);
    } else {
      next({
        message: 'Tipo de arquivo não suportado.'
      }, false);
    };
  },
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (req.file === undefined) {
    next();
    return
  };

  let post = null;
  let filename;

  if (req.params.slug) {
    post = await Post.findOne({
      slug: req.params.slug,
    });
  };

  if (post) {
    if (post.photo) {
      filename = post.photo.split('.')[0];
    } else {
      filename = post.public_id;
    };
  } else {
    filename = uuid.v4();
  };

  const extension = '.webp'
  req.body.photo = filename + extension;

  const photo = await jimp.read(req.file.buffer);
  photo.resize(800, jimp.AUTO);
  photo.write(`./public/uploads/${filename}${extension}`);

  next();
};