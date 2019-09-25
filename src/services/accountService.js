import PlaidModel from "../models/plaidModel";
import AccountModel from "../models/accountModel";

const getAccessToken = async req => {
  try {
    const plaidData = await PlaidModel.getAccessToken(req);

    const plaidAccountData = await PlaidModel.getAccountDetails(plaidData);

    plaidData.data = {
      accounts: plaidAccountData.accounts,
      institution: req.body.data.institution
    };
    plaidData.status = {
      code: 200,
      error: ``,
      msg: ``
    };

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

const getAccounts = async req => {
  const userId = req.params.id;
  const returnData = {};

  try {
    const accountsData = await AccountModel.getAll(userId);
    returnData.data = accountsData.data;
    returnData.status = accountsData.status;
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

const AccountService = {
  getAccessToken: getAccessToken,
  getAccounts: getAccounts
};

export default AccountService;
