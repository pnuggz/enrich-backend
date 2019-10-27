const path = require("path")
const InstitutionModel = require(path.join(__dirname, "../models/institutionModel.js"))
const AccountModel = require(path.join(__dirname, "../models/accountModel.js"))

const returnData = {}

const getInstitutions = async () => {
  try {
    const institutionsResponse = await InstitutionModel.getInstitutions()
    if (institutionsResponse.status.code !== 200) {
      returnData.status = institutionsResponse.status
      return returnData
    }

    returnData.status = institutionsResponse.status
    returnData.data = institutionsResponse.data
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
};

const getInstitutionsByUser = async (req) => {
  const userId = req.user.id

  try {
    const institutionsResponse = await InstitutionModel.getInstitutionsByUser(userId)
    if (institutionsResponse.status.code !== 200) {
      returnData.status = institutionsResponse.status
      return returnData
    }

    returnData.status = institutionsResponse.status
    returnData.data = institutionsResponse.data
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
};

const getInstitutionsByUserWithAccounts = async (req) => {
  const userId = req.user.id

  try {
    const institutionsResponse = await InstitutionModel.getInstitutionsByUser(userId)
    if (institutionsResponse.status.code !== 200) {
      returnData.status = institutionsResponse.status
      return returnData
    }
    const institutions = institutionsResponse.data

    const accountsResponse = await AccountModel.getAccountsByUser(userId)
    if (accountsResponse.status.code !== 200) {
      returnData.status = accountsResponse.status
      return returnData
    }
    const accounts = accountsResponse.data

    const institutionsWithAccounts = institutions.map(institution => {
      institution.accounts = accounts.filter(account => institution.id === account.institution_id)
      return institution
    })

    returnData.status = institutionsResponse.status
    returnData.data = institutionsWithAccounts
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
};

const asyncSaveInstitutions = institutions => {
  InstitutionModel.saveInstitutions(institutions);
};

const InstitutionService = {
  asyncSaveInstitutions: asyncSaveInstitutions,
  getInstitutions: getInstitutions,
  getInstitutionsByUser: getInstitutionsByUser,
  getInstitutionsByUserWithAccounts: getInstitutionsByUserWithAccounts
};

module.exports = InstitutionService;
