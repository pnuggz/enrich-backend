import UserModel from "../models/userModel";

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

const UserService = {
  linkPlaidAccount: linkPlaidAccount
};

export default UserService;
