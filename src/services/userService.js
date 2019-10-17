import UserModel from "../models/userModel";

const returnData = {};

const linkPlaidAccount = async (req, plaidData) => {
  const returnData = {};
  const data = req.body.data;
  const userData = data.user;

  try {
    const updatedUserData = await UserModel.linkPlaidAccount(
      userData,
      plaidData
    );
    const updatedUserDataStatusCode = updatedUserData.status.code;
    if (updatedUserDataStatusCode === 500) {
      returnData.status = updatedUserData.status;
      return returnData;
    }

    returnData.data = updatedUserData.data;
    returnData.status = updatedUserData.status;
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

const getPlaidData = async userId => {
  try {
    const plaidData = await UserModel.getPlaidData(userId);
    returnData.status = plaidData.status;
    if (plaidData.status.code !== 200) {
      return returnData;
    }

    returnData.data = plaidData.data;
    return returnData;
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal error with getting the accounts.`
    };
    return returnData;
  }
};

const getUserData = async req => {
  const userId = req.user.id;
};

const UserService = {
  getPlaidData: getPlaidData
};

export default UserService;
