import PlaidModel from "../models/plaidModel";

const getAccessToken = async req => {
  try {
    const plaidData = await PlaidModel.getAccessToken(req);
    plaidData.status = {
      code: 200,
      error: ``,
      msg: ``
    };

    const plaidAccountData = await PlaidModel.getAccountDetails(plaidData);
    plaidData.accountData = plaidAccountData;

    return plaidData;
  } catch (err) {
    console.log(err);
    return {
      status: {
        code: 500,
        error: err,
        msg: `Internal error with the exchange of token and getting of details.`
      }
    };
  }
};

const AccountService = {
  getAccessToken: getAccessToken
};

export default AccountService;
