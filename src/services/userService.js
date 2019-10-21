import PasswordEncryption from "../library/passwordEncyption"

import BasiqService from "../services/basiqService"

import UserModel from "../models/userModel"

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

const checkOrCreateBasiqUser = async req => {
  const userId = req.user.id

  const basiqIdResponse = await UserModel.getUserBasiqAccount(userId)
  if(basiqIdResponse.status.code !== 200) {
    returnData.status = basiqIdResponse.status
    return returnData
  }

  if(basiqIdResponse.data.length === 1) {
    returnData.status = basiqIdResponse.status
    returnData.data = basiqIdResponse.data
    return returnData
  }

  const userResponse = await UserModel.getUser(userId)
  if(userResponse.status.code !== 200) {
    returnData.status = userResponse.status
    return returnData
  }

  const userEmail = userResponse.data[0].email
  const createdBasiqIdResponse = await BasiqService.createUser(req, userEmail)
  if(createdBasiqIdResponse.status.code !== 200) {
    returnData.status = createdBasiqIdResponse.status
    return returnData
  }

  const basiqId = createdBasiqIdResponse.data.id
  const linkBasiqAccountResponse = await UserModel.linkUserBasiqAccount(userId, basiqId)
  if(linkBasiqAccountResponse !== 200) {
    returnData.status = linkBasiqAccountResponse.status
    return returnData
  }

  const newBasiqIdResponse = await UserModel.getUserBasiqAccount(userId)
  if(newBasiqIdResponse.status.code !== 200) {
    returnData.status = newBasiqIdResponse.status
    return returnData
  }

  returnData.status = {
    code: 200,
    error: ``,
    message: ``
  }
  returnData.data = newBasiqIdResponse.data
  return returnData
}

const linkUserInstitutionResponse = async req => {
  
}

const UserService = {
  signupUser: signupUser,
  checkOrCreateBasiqUser: checkOrCreateBasiqUser
};

export default UserService;
