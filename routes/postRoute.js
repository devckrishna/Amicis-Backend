const express = require('express');
const PostController = require('../controllers/PostController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/uploadpost')
  .post(
    authController.protect,
    PostController.uploadPost,
    PostController.resizeUserPost,
    PostController.createPost
  );

router
  .route('/like/:id')
  .patch(authController.protect, PostController.likePost);
router
  .route('/unlike/:id')
  .patch(authController.protect, PostController.unlikePost);

router
  .route('/comment/:id')
  .patch(authController.protect, PostController.commentPost);
router
  .route('/deletepost/:postId')
  .delete(authController.protect, PostController.deletePost);
module.exports = router;
