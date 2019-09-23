import UserModel from "../models/userModel";

const linkPlaidAccount = async (req, plaidData) => {
  const data = req.body;
  const userData = data.user;

  try {
    const updatedUserData = await UserModel.linkPlaidAccount(
      userData,
      plaidData
    );
    updatedUserData.status = {
      code: 200,
      error: ``,
      msg: `Account has been successfully linked.`
    };
    return updatedUserData;
  } catch (err) {
    userData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with linking of the Plaid account with the database.`
    };
    return userData;
  }
};

const UserService = {
  linkPlaidAccount: linkPlaidAccount
};

export default UserService;
