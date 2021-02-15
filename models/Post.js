const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: 'The post needs an _id',
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
  },
  body: {
    type: String,
    trim: true,
  },
  tags: [String],
});

module.exports = mongoose.model('Post', postSchema);