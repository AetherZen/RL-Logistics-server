const express =require("express");
const router = express.Router();
// middlewares
const {authenticated,admin}= require("../middleware/authentication.js") ;
const {testUser}= require("../middleware/testUser.js") ;


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
} =require("../controllers/auth.js");


// ***********navigate way***************
router.post("/register", register);
router.post("/login", login);
router.get("/login-check", authenticated, isLoginCheck);
router.get("/admin-check", authenticated, admin,isAdminCheck);
router.put("/profile", authenticated,testUser, updateProfile); //logged in but if test user then can't update profile
router.get("/secret", authenticated, admin, secret); // testing
router.get("/all-users", authenticated, admin, getAllUsers);   // get all users
router.put("/admin/update-role", authenticated, admin, updateRole);  //change user role


// ***********export default****************
module.exports= router;
