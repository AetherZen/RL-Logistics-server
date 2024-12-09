const express = require('express');
const router = express.Router();
// middlewares
const { authenticate, authorizeAdmin } = require('../middleware/authentication.js');
const { testUser } = require('../middleware/testUser.js');

// *************controllers************
const {
  register,
  login,
  isLoginCheck,
  isAdminCheck,
  secret,
  updateProfile,
  getAllUsers,
  updateRole,
} = require('../controllers/auth.js');

// ***********navigate way***************
router.post('/register', register);
router.post('/login', login);
router.get('/login-check', authenticate, isLoginCheck);
router.get('/admin-check', authenticate, authorizeAdmin, isAdminCheck);
router.put('/profile', authenticate, testUser, updateProfile); //logged in but if test user then can't update profile
router.get('/secret', authenticate, authorizeAdmin, secret); // testing
router.get('/all-users', authenticate, authorizeAdmin, getAllUsers); // get all users
router.put('/admin/update-role', authenticate, authorizeAdmin, updateRole); //change user role

// ***********export default****************
module.exports = router;
