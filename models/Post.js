const mongoose = require('mongoose');
const slug = require('slug');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: 'The post needs an public_id',
    unique: true,
  },
  photo: String,
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
  slug_count: {
    type: Number,
    required: true,
    default: 1,
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

postSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    this.slug = slug(this.title, {
      lower: true
    });

    const slugRegex = new RegExp(`^(${this.slug})((--[0-9]{1,})?)$`);

    const postsWithSlug = await this.constructor.find({
      slug: slugRegex
    }).sort({
      slug_count: -1
    }).limit(1);

    if (postsWithSlug.length === 1) {
      this.slug_count = postsWithSlug[0].slug_count + 1;
      this.slug = `${this.slug}--${this.slug_count}`;
    };
  };

  next();
});

postSchema.statics.getTagsList = function () {
  return this.aggregate([{
    $unwind: '$tags'
  }]);
};

module.exports = mongoose.model('Post', postSchema);