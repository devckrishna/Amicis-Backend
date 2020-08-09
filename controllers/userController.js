const User = require('../models/userModel');

exports.follow = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.body.id,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
  next();
};

exports.addfollow = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.id },
      },
      { new: true }
    );

    res.status(200).json({
      status: 'Followed',
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
  next();
};

exports.unfollow = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.id },
      },
      { new: true }
    );

    res.status(200).json({
      status: 'unFollowed',
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
  next();
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
  next();
};
