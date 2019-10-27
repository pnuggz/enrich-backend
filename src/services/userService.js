const path = require("path")

const PasswordEncryption = require(path.join(__dirname, "../library/passwordEncyption"))

const BasiqService = require(path.join(__dirname, "../services/basiqService"))

const UserModel = require(path.join(__dirname, "../models/userModel"))
const JobModel = require(path.join(__dirname, "../models/jobModel"))
const InstitutionModel = require(path.join(__dirname, "../models/institutionModel"))

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

const getUserBasiqData = async req => {
  const userId = req.user.id

  const userBasiqDataResponse = await UserModel.getUserBasiqData(userId)
  if (userBasiqDataResponse.status.code !== 200) {
    returnData.status = userBasiqDataResponse.status
    return returnData
  }

  returnData.status = returnData.status = {
    code: 200,
    error: ``,
    message: ``
  }
  returnData.data = userBasiqDataResponse.data
  return returnData
}

const getUserBasiqAccounts = async req => {
  const userId = req.user.id

  const userBasiqDataResponse = await UserModel.getUserBasiqAccounts(userId)
  if (userBasiqDataResponse.status.code !== 200) {
    returnData.status = userBasiqDataResponse.status
    return returnData
  }

  returnData.status = {
    code: 200,
    error: ``,
    message: ``
  }
  returnData.data = userBasiqDataResponse.data
  return returnData
}

const saveUserBasiqAccounts = async req => {
  const userId = req.user.id
  const data = req.body
  const basiqInstitutionId = data.basiqInstitutionId
  const accounts = data.accounts

  const getInstitutionsByBasiqInstitutionIdResponse = await InstitutionModel.getInstitutionsByBasiqInstitutionId(basiqInstitutionId)
  if (getInstitutionsByBasiqInstitutionIdResponse.status.code !== 200) {
    returnData.status = getInstitutionsByBasiqInstitutionIdResponse.status
    return returnData
  }

  const institutionId = getInstitutionsByBasiqInstitutionIdResponse.data[0].id
  const saveAccountsResponse = await UserModel.saveUserBasiqAccounts(userId, institutionId, accounts)
  if (saveAccountsResponse.status.code !== 200) {
    returnData.status = saveAccountsResponse.status
    return returnData
  }

  returnData.status = {
    code: 200,
    error: ``,
    message: ``
  }
  return returnData
}

const checkOrCreateBasiqUser = async req => {
  const userId = req.user.id

  const basiqIdResponse = await UserModel.getUserBasiqAccount(userId)
  if (basiqIdResponse.status.code !== 200) {
    returnData.status = basiqIdResponse.status
    return returnData
  }

  if (basiqIdResponse.data.length === 1) {
    returnData.status = basiqIdResponse.status
    returnData.data = basiqIdResponse.data
    return returnData
  }

  const userResponse = await UserModel.getUser(userId)
  if (userResponse.status.code !== 200) {
    returnData.status = userResponse.status
    return returnData
  }

  const userEmail = userResponse.data[0].email
  const createdBasiqIdResponse = await BasiqService.createUser(req, userEmail)
  if (createdBasiqIdResponse.status.code !== 201) {
    returnData.status = createdBasiqIdResponse.status
    return returnData
  }

  const basiqId = createdBasiqIdResponse.data.id
  const linkBasiqAccountResponse = await UserModel.linkUserBasiqAccount(userId, basiqId)
  if (linkBasiqAccountResponse !== 200) {
    returnData.status = linkBasiqAccountResponse.status
    return returnData
  }

  const newBasiqIdResponse = await UserModel.getUserBasiqAccount(userId)
  if (newBasiqIdResponse.status.code !== 200) {
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

const linkUserInstitution = async (req, userBasiqData) => {
  const userId = req.user.id
  const bodyData = req.body

  const basiqId = userBasiqData[0].basiq_id
  const institutionId = bodyData.institution.value
  const loginData = {
    login: bodyData.login.value,
    password: bodyData.password.value
  }

  const createBasiqConnectionResponse = await BasiqService.createUserConnection(req, basiqId, institutionId, loginData)
  if (createBasiqConnectionResponse.status.code !== 202) {
    returnData.status = createBasiqConnectionResponse.status
    return returnData
  }

  if (createBasiqConnectionResponse.data.type !== "job") {
    returnData.status = createBasiqConnectionResponse.status
    returnData.data = createBasiqConnectionResponse.data
    return returnData
  }

  // TEMPORARILLY SAVE TO DB - EVENTUALLY SAVE TO CACHE
  const basiqJobId = createBasiqConnectionResponse.data.id
  const saveBasiqJobResponse = await JobModel.saveBasiqConnectionJob(userId, basiqJobId, institutionId)
  if (saveBasiqJobResponse.status.code !== 200) {
    returnData.status = saveBasiqJobResponse.status
    return returnData
  }

  returnData.status = {
    code: 202,
    error: ``,
    message: ``
  }
  delete returnData.data
  return returnData
}

const UserService = {
  signupUser: signupUser,
  checkOrCreateBasiqUser: checkOrCreateBasiqUser,
  linkUserInstitution: linkUserInstitution,
  getUserBasiqData: getUserBasiqData,
  getUserBasiqAccounts: getUserBasiqAccounts,
  saveUserBasiqAccounts: saveUserBasiqAccounts
};

module.exports = UserService;
