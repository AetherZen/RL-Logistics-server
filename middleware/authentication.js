const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

exports.authenticated = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization //in header.authorization we will get token
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    //token will be like, Bearer tokenCode so we use startsWith
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  // after getting the token it wil be like, Bearer tokenCode so we will split it and get tokenCode from the second index of the array which is 1

  try {
    //verify the token and get the payload which is the user id and name
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const testUser = payload._id === '6425dda09222784de0f5e6c0';
    // attach the user to the job routes
    req.user = { _id: payload._id, testUser }

    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

exports.admin = async (req, res, next) => {

    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      throw new UnauthenticatedError('Admin resource. Access denied');
    } else {
      next();
    }

};