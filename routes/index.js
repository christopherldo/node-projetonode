const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', homeController.index);

router.get('/users/login',
  authMiddleware.isGuest,
  userController.login
);
router.post('/users/login',
  authMiddleware.isGuest,
  userController.loginAction
);

router.get('/users/logout', userController.logout);

router.get('/users/register',
  authMiddleware.isGuest,
  userController.register
);
router.post('/users/register',
  authMiddleware.isGuest,
  userController.registerAction
);

router.get('/users/forgot-password',
  authMiddleware.isGuest,
  userController.forgotPassword
);
router.post('/users/forgot-password',
  authMiddleware.isGuest,
  userController.forgotPasswordAction
);

router.get('/users/reset/:token',
  authMiddleware.isGuest,
  userController.forgotPasswordToken
);

router.post('/users/reset/:token',
  authMiddleware.isGuest,
  userController.forgotPasswordTokenAction
);

router.get('/profile',
  authMiddleware.isLogged,
  userController.profile
);
router.post('/profile',
  authMiddleware.isLogged,
  userController.profileAction
);

router.post('/profile/password',
  authMiddleware.isLogged,
  authMiddleware.changePassword
);

router.get('/post/add',
  authMiddleware.isLogged,
  postController.add
);
router.post('/post/add',
  authMiddleware.isLogged,
  imageMiddleware.upload,
  imageMiddleware.resize,
  postController.addAction
);

router.get('/post/:slug/edit',
  authMiddleware.isLogged,
  postController.canEdit,
  postController.edit
);
router.post('/post/:slug/edit',
  authMiddleware.isLogged,
  postController.canEdit,
  imageMiddleware.upload,
  imageMiddleware.resize,
  postController.editAction
);

router.get('/post/:slug/delete', 
  authMiddleware.isLogged,
  postController.canEdit,
  postController.delete
);

router.get('/post/:slug', postController.view);

module.exports = router;