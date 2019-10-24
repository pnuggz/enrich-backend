const path = require("path")
const InstitutionModel = require(path.join(__dirname, "../models/institutionModel.js"))

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
  try {
    const institutionsResponse = await InstitutionModel.getInstitutionsByUser(req)
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

const asyncSaveInstitutions = institutions => {
  InstitutionModel.saveInstitutions(institutions);
};

const InstitutionService = {
  asyncSaveInstitutions: asyncSaveInstitutions,
  getInstitutions: getInstitutions,
  getInstitutionsByUser: getInstitutionsByUser
};

module.exports = InstitutionService;
