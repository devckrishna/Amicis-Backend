const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/PostModel');

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

exports.uploadPost = upload.single('photo');

exports.resizeUserPost = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/Posts/${req.file.filename}`);
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }

  next();
};

exports.createPost = async (req, res, next) => {
  try {
    let photos;
    if (req.file) {
      photos = req.file.filename;
    }
    const post = await Post.create({
      photo: photos,
      user: req.user.id,
      caption: req.body.caption,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      dateCreated: Date.now(),
    });

    await post.populate('userid');
    res.status(200).json({
      status: 'Success',
      data: [post],
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
};

exports.likePost = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    res.status(200).json({
      status: 'Success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
};

exports.unlikePost = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    res.status(200).json({
      status: 'Success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
};

exports.commentPost = async (req, res, next) => {
  const comment = {
    comText: req.body.comText,
    postedBy: req.user._id,
  };
  try {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: comment },
      },
      { new: true }
    ).populate('comments');

    res.status(200).json({
      status: 'Success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate('user');
    if (!post) return next(new Error('No post with this id exist'));

    if (post.user._id.toString() === req.user._id.toString()) {
      await Post.findByIdAndDelete(req.params.postId);
    }
    res.status(200).json({
      status: 'Deleted',
    });
  } catch (err) {
    res.status(404).json({
      status: 'FAil',
      message: err.message,
    });
  }
};
