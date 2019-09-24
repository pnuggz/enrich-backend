import bcrypt from "bcryptjs"

import SignupModel from "../models/signupModel";

const submit = async req => {
  const returnData = {}

  try {
    const pass = req.body.password.value
    const passSalt = await genPassSalt()
    const hashedPass = await hashPass(pass, passSalt)
    req.body.password.value = hashedPass
    req.body.password_salt = {
      value: passSalt
    }

    const userData = await SignupModel.create(req);
    returnData.data = userData
    returnData.status = {
      code: 200,
      error: ``,
      msg: ``
    }

    return userData;
  } catch(err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with the signup up data submission`
    }
    return returnData
  }
};

const authenticate = async req => {
  const returnData = {}

  try{
    const userData = await SignupModel.authenticate(req);
    const userDataStatusCode = userData.status.code
    if(userDataStatusCode === 500) {
      returnData.status = userData.status
      return returnData
    }
    
    returnData.data = userData.data
    returnData.status = userData.status
    return returnData
  } catch(err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with verification of the user.`
    }
    return returnData
  }
};

const SignupService = {
  submit: submit,
  authenticate: authenticate
};

export default SignupService;


// Private functions for password generation
const genPassSalt = () => {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {
        console.log(err)
        rej(err)
      }
      res(salt)
    })
  })
}

const hashPass = (pass, passSalt) => {
  return new Promise((res, rej) => {
    bcrypt.hash(pass, passSalt, (err, hash) => {
      if(err) {
        console.log(err)
        rej(err)
      }
      res(hash)
    })
  })
}