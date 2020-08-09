const Post = require('../models/PostModel');

exports.showFullFeed = async (req, res, next) => {
  try {
    const feed = await Post.find().populate({
      path: 'comments.postedBy ',
      select: 'name',
    });
    res.status(200).json({
      status: 'Success',
      data: [feed],
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.showFollowingFeed = async (req, res, next) => {
  try {
    const feed = await Post.find({ user: { $in: req.user.following } }).populate({
      path: 'user',
      select: 'name',
    });

    res.status(200).json({
      status: 'Success',
      data: [feed],
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};
