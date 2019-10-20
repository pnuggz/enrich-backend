import PasswordEncryption from "../library/passwordEncyption"

import UserModel from "../models/userModel.js"

const returnData = {};

const signupUser = async req => {
  try {
    const pass = req.body.password.value

    const passSalt = await PasswordEncryption.genPasswordSalt()
    const hashedPass = await PasswordEncryption.hashPassword(pass, passSalt)

    req.body.password.value = hashedPass;
    req.body.password_salt = {
      value: passSalt
    };

    const createUserResponse = await UserModel.createUser(req)
    if (createUserResponse.status.code !== 200) {
      returnData.status = createUserResponse.status
      return returnData
    }

    const userId = createUserResponse.data.insertId
    const getUserReponse = await UserModel.getUser(userId)
    if (getUserReponse.status.code !== 200) {
      returnData.status = getUserReponse.status
      return returnData
    }

    const user = getUserReponse.data[0]
    const username = user.username

    const createVerificationTokenResponse = await UserModel.createVerificationToken(userId, username)
    if (createVerificationTokenResponse.status.code !== 200) {
      returnData.status = createVerificationTokenResponse.status
      return returnData
    }

    const getVerificationTokenResponse = await UserModel.getVerificationTokenByUser(userId)
    if (getVerificationTokenResponse.status.code !== 200) {
      returnData.status = getVerificationTokenResponse.status
      return returnData
    }
    const verification = getVerificationTokenResponse.data[0]

    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    }
    returnData.data = {
      user: user,
      verification: verification
    }
    return returnData
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
}

const SignupService = {
  signupUser: signupUser
};

export default SignupService;
