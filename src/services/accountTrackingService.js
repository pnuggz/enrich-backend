import AccountTrackingModel from "../models/accountTrackingModel";

const returnData = {};

const createAccountTracking = async (req, accountsData) => {
  const userId = req.user.id;

  try {
    const accountTrackingData = await AccountTrackingModel.createAccountTracking(
      accountsData,
      req
    );
    const accountTrackingDataSatusCode = accountTrackingData.status.code;
    if (accountTrackingDataSatusCode === 500) {
      returnData.status = accountTrackingData.status;
      return returnData;
    }

    returnData.status = accountTrackingData.status;
    return returnData;
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with linking of account to user.`
    };
    return returnData;
  }
};

const AccountTrackingService = {
  createAccountTracking: createAccountTracking
};

module.exports = AccountTrackingService;
