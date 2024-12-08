const express =require("express");

const router = express.Router();

// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;
const {testUser}= require("../middleware/testUser.js") ;
// controllers
const {
  register,
  login,
  isLoginCheck,
  isAdminCheck,
  secret,
  updateProfile,
  getAllUsers,
  updateRole,
} =require("../controllers/auth.js");

router.post("/register", register);
router.post("/login", login);
router.get("/login-check", authenticated, isLoginCheck);
router.get("/admin-check", authenticated, admin,isAdminCheck);

//logged in but if test user then can't update profile
router.put("/profile", authenticated,testUser, updateProfile);

// testing
router.get("/secret", authenticated, admin, secret);


// get all users
router.get("/all-users", authenticated, admin, getAllUsers);
//change user role
router.put("/admin/update-role", authenticated, admin, updateRole);
module.exports= router;
