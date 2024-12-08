// const CustomAPIError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })

  //docs: custom error definition
  //when user does not provide any of the values
  //suppose when registration user does not provide any of the values like name,email,password
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  //as email is unique.so if yser try to register with same email 2nd time
  if (err.code && err.code === 11000) {
    //without Object.keys(err.keyValue) it will show like this Object Object
    //with Object.keys(err.keyValue) it will show like this "email" 
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }
  //when the id synxat does not match what the mongoose is looking for
  //like giving the id with one less value/digit
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

 
  return res.status(customError.statusCode).json({ msg: customError.msg }) //ref: 2
  // fn
   // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }) //ref: 3
   //for defining custom error first comment the upper return(ref:2) then uncomment the lower return(ref:3).
   //then observe the error and define own custom error
   //after defining custom error comment ref"3" and uncomment ref"2"
   //done
}

module.exports = errorHandlerMiddleware
