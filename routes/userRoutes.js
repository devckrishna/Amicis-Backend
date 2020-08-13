const express = require('express');
const authConroller = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authConroller.signup);
router.post('/login', authConroller.login);
router.get('/logout', authConroller.logout);

router.post('/forgotPassword', authConroller.forgotPassword);
router.patch('/resetPassword/:token', authConroller.resetPassword);

router.get('/:id', userController.getUser);

router.patch('/updateMyPassword', authConroller.updatePassword);

router.patch(
  '/uploadprofilephoto',
  authConroller.protect,
  userController.uploadPhoto,
  userController.resizeUserPost,
  userController.uploadProfilePhoto
);

router.patch(
  '/follow',
  authConroller.protect,
  userController.follow,
  userController.addfollow
);
router.patch('/unfollow', authConroller.protect, userController.unfollow);

module.exports = router;
