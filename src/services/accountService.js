import PlaidModel from "../models/plaidModel";

const getAccessToken = async req => {
  return userData = await PlaidModel.getAccessToken(req)
};

const AccountService = {
  getAccessToken: getAccessToken
};

export default AccountService;
