const mongoose = require('mongoose');
const slug = require('slug');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
  public_id: String,
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
  created_at: Date,
  author: {
    type: ObjectId,
    ref: 'User',
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
    },
    {
      $group: {
        _id: '$tags',
        count: {
          $sum: 1
        },
      },
    },
    {
      $sort: {
        count: -1,
        _id: 1,
      },
    },
  ]);
};

postSchema.statics.findPosts = function (filters = {}) {
  return this.find(filters).populate('author');
};

module.exports = mongoose.model('Post', postSchema);