const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');



// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

   // Validate input
  if (!name.trim()) {
    throw new BadRequestError('Please provide name');
  }
  if (!email) {
    throw new BadRequestError('Please provide email');
  }
  if (!password || password.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters long');
  }


  // Check if the email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email is already taken');
  }

  // Create new user
  const user = await User.create({ ...req.body });
  const token = user.createJWT(); //generate token by using user model method
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
    token,
  });
};






// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

    // Validate input
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
    //return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and password' })
  }
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  
  // Validate password
  const isPasswordCorrect = await user.comparePassword(password); //method from user model
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password is incorrect');
  }

  // if password correct Generate JWT token
  const token = user.createJWT(); //method from user model,in token it will have user id and name
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
    token,
  });
};





//docs: login status check
exports.isLoginCheck = async (req, res) => {
  res.status(StatusCodes.OK).json({ login: true });
};





//docs: admin check
exports.isAdminCheck = async (req, res) => {
  res.status(StatusCodes.OK).json({ admin: true });
};





// Get the current user's details
exports.secret = async (req, res) => {
  const user = await User.findById(req.user._id)
  .select('-password -createdAt -updatedAt');
  res.status(StatusCodes.OK).json({ currentUser: user });
};





// docs: update profile
exports.updateProfile = async (req, res) => {
  const { name, password, address } = req.body;
  const user = await User.findById(req.user._id); //req.user._id comes from authmiddleware

  // check password length
  if (password && password.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters long');
  }

  // Update user details
  user.name = name || user.name;
  user.address = address || user.address;
  user.password = password || user.password;

  const updatedUser = await user.save();

  res.status(StatusCodes.OK).json({
    name: updatedUser.name,
    email: updatedUser.email,
    address: updatedUser.address,
    role: updatedUser.role,
  });
};





// docs: get all users for admin purpose
exports.getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password -createdAt -updatedAt');
  res.status(StatusCodes.OK).json(users);
};





// Update user role (admin functionality)
exports.updateRole = async (req, res) => {
  const { email, setRole } = req.body;

  // Find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new BadRequestError('User not found');
  }

   // Update role based on input
   const updatedRole = setRole === 'admin' ? 1 : 0;
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { role: updatedRole },
    { new: true }
  );
  res.status(StatusCodes.OK).json(updatedUser);
};
