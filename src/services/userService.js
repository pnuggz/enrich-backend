import UserModel from "../models/userModel";

const linkPlaidAccount = async (req, plaidData) => {
  const data = req.body;
  const userData = data.user;

  const updatedUserData = await UserModel.linkPlaidAccount(
    userData,
    plaidData
  );

  return updatedUserData
};

const UserService = {
  linkPlaidAccount: linkPlaidAccount
};

export default UserService;
