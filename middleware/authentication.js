const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const envFile = require('../config')



// Middleware to authenticate users
const authenticate = async (req, res, next) => {
 // Check if the Authorization header exists
  const authHeader = req.headers.authorization; //in header.authorization we will get token
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    //token will be like, Bearer tokenCode so we use startsWith
    throw new UnauthenticatedError('Authentication invalid');
  }


  // Extract token from the header
  const token = authHeader.split(' ')[1];
  // after getting the token it wil be like, Bearer tokenCode so we will split it and get tokenCode from the second index of the array which is 1

  try {
    //verify the token and get the payload which is the user id and name
    const payload = jwt.verify(token, envFile.JWT_SECRET);

    // Optional: Identify if it's a test user
    const testUser = payload._id === '6425dda09222784de0f5e6c0';
    
     // Attach user details to the request object
    req.user = { _id: payload._id, testUser };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};



// Middleware to authorize admin access
const authorizeAdmin = async (req, res, next) => {
  try {
    // Fetch user details from the database
    const user = await User.findById(req.user._id);

    // Check if the user has admin privileges
    if (user.role !== 1) {
      throw new UnauthenticatedError('Admin resource. Access denied');
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};



// ************export default******************
module.exports = { authenticate, authorizeAdmin };