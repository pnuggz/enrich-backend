import UserModel from "../models/userModel";

const test = async () => {
  // return { user: "TEST" };
  const userRecord = await UserModel.get();
  return userRecord;
};

const UserService = {
  test: test
};

export default UserService;
