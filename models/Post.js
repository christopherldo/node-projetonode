const mongoose = require('mongoose');
const slug = require('slug');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: 'The post needs an _id',
    default: uuid.v4,
    unique: true,
  },
  title: {
    type: String,
    trim: true,
    required: 'The post needs a title',
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
  },
  body: {
    type: String,
    trim: true,
    required: 'The post needs a body',
  },
  tags: [String],
  created_at: {
    type: Date,
    default: new Date().toISOString(),
  },
});

postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slug(this.title, {
      lower: true
    });
  };

  next();
});

module.exports = mongoose.model('Post', postSchema);