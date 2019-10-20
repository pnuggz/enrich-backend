import PasswordEncryption from "../library/passwordEncyption"

import UserModel from "../models/userModel"
import TokenModel from "../models/tokenModel"

const returnData = {};

const authorizeUser = async req => {
  const data = req.body;
  const uniqueLogin = data.uniqueLogin.value;
  const password = data.password.value;

  try {
    const userResponse = await UserModel.getUserByLoginIncPassword(uniqueLogin)
    if (userResponse.status.code !== 200) {
      returnData.status = userResponse.status;
      return returnData;
    }
    if (userResponse.data.length !== 1) {
      returnData.status = {
        code: 401,
        error: `Bad authorisation`,
        message: `Incorrect login details provided.`
      }
      return returnData
    }

    const user = userResponse.data[0]
    const dbPassword = user.password
    const passSalt = user.password_salt;
    delete user.password
    delete user.password_salt

    const hashedPass = await PasswordEncryption.hashPassword(password, passSalt)

    if (dbPassword !== hashedPass) {
      returnData.status = {
        code: 401,
        error: `Bad authorisation`,
        message: `Incorrect login details provided.`
      }
      return returnData
    }

    const tokenResult = TokenModel.generateToken(req, { user: user })

    returnData.status = userResponse.status
    returnData.data = user
    returnData.token = tokenResult.token
    returnData.tokenCreatedDate = tokenResult.tokenCreatedDate
    return returnData
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with validation of the user.`
    };
    return returnData
  }
}

const LoginService = {
  authorizeUser: authorizeUser
};

export default LoginService;
