const { BadRequestError } = require('../errors');

exports.testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Test User. Read Only');
  }
  next();
};


