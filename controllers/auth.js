const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

//docs: registration
exports.register = async (req, res) => {

  const { name, email, password } = req.body;
  if (!name.trim()) {
    // return res.json({ error: "Name is required" });
    throw new BadRequestError('Please provide name')
  }
  if (!email) {
    throw new BadRequestError('Please provide email')
  }
  if (!password || password.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters long')
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email is taken')
  }
  const user = await User.create({ ...req.body })
  const token = user.createJWT() //generate token by using user model method
  res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email, role: user.role, address: user.address }, token })
};

//docs: login 
exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
    //if we donot use error handler then we will do this like,
    //return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and password' })
  }
  //check for user using email
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  //after getting user we will compare password
  const isPasswordCorrect = await user.comparePassword(password) //method from user model
  //if password is not correct
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password is incorrect')
  }
  // if password is correct then we will generate token
  const token = user.createJWT() //method from user model,in token it will have user id and name
  res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email, role: user.role, address: user.address }, token })
}


//docs: login status check
exports.isLoginCheck = async (req, res) => {
  res.status(StatusCodes.OK).json({ login: true })
}
//docs: admin check
exports.isAdminCheck = async (req, res) => {
  res.status(StatusCodes.OK).json({ admin: true })
}
// docs: user id getting
exports.secret = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -createdAt -updatedAt");
  res.status(StatusCodes.OK).json({ currentUser: user });
  //req.user is the user's id and by this we can get the user
};


// docs: update profile 
exports.updateProfile = async (req, res) => {

    const { name, password, address } = req.body;
    const user = await User.findById(req.user._id); //req.user._id comes from authmiddleware


    // check password length
    if (password && password.length < 6) {
     throw new BadRequestError('Password must be at least 6 characters long')
    }

    user.name = name || user.name;
    user.address = address || user.address;
    user.password = password || user.password;

    const updated= await user.save();

    res.status(StatusCodes.OK).json({
      name: updated.name,
      email: updated.email,
      address: updated.address,
      role: updated.role,
    });

};

// docs: get all users for admin purpose
exports.getAllUsers = async (req, res) => {

    const users = await User.find({}).select("-password -createdAt -updatedAt");
    res.status(StatusCodes.OK).json(users);

};

// docs: update role
exports.updateRole = async (req, res) => {

    const { email, setRole } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (setRole === "admin") {
      const updated = await User.findByIdAndUpdate(
        user._id,
        {
          role: 1,
        },
        { new: true }
      );
      res.status(StatusCodes.OK).json(updated);
    } else {
      const updated = await User.findByIdAndUpdate(
        user._id,
        {
          role: 0,
        },
        { new: true }
      );
      res.json(updated);
    }
}