const User = require('../models/userModel');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image!!'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPost = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/Users/${req.file.filename}`);
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }

  next();
};

exports.uploadProfilePhoto = async (req, res, next) => {
  try {
    const photo = req.file.filename;
    const user = await User.findByIdAndUpdate(req.user._id, {
      photo: photo,
    });
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
};

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
