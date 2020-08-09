const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user'],
    },
    photo: {
      type: String,
      default: 'No Image',
    },
    caption: {
      type: String,
    },
    latitude: Number,
    longitude: Number,

    dateCreated: Date,
    dateUpdated: Date,
    likes: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        comText: String,
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
