const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // for hashing password
const jwt = require('jsonwebtoken'); // for creating token
const envFile  = require('../config');


// create schema for user
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true, // email should be unique, so that no one can register with same email
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Hashing password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // if password is not modified, return
  const salt = await bcrypt.genSalt(10); //when user is created, password is at modified state and it will be hashed
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



/* Creating JWT token
    we will create it here so that the controller will be clean
    it is a method of UserSchema so when we call it in controller we will have out token there
*/


UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { _id: this._id }, //in token we will save user id and name
    envFile.JWT_SECRET,
    {
      expiresIn: envFile.JWT_LIFETIME,
    }
  );
};



//in case of login we will compare password with the one in database
//candidatePassword is the password that user entered in login form
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};


// ***********export default****************
module.exports = mongoose.model('User', UserSchema);
