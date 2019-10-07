import PlaidModel from "../models/plaidModel";
import AccountModel from "../models/accountModel";

const returnData = {};

const getAccessToken = async req => {
  try {
    const plaidData = await PlaidModel.getAccessToken(req);
    if(plaidData.status.code !== 200) {
      returnData.status = plaidData.status
      return returnData
    }

    const plaidResponseData = plaidData.data
    const plaidAccountData = await PlaidModel.getAccountDetails(plaidResponseData);
    if(plaidAccountData.status.code !== 200) {
      returnData.status = plaidAccountData.status
      return returnData
    }

    returnData.data = {
      accounts: plaidAccountData.data.accounts,
      institution: req.body.data.institution
    };
    returnData.status = {
      code: 200,
      error: ``,
      msg: ``
    };

    return returnData;
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

const linkAccount = async req => {
  
}

const getAccounts = async req => {
  const userId = req.user.id;

  try {
    const accountsData = await AccountModel.getAll(userId);
    returnData.status = accountsData.status;
    if(accountsData.status.code !== 200) {
      return returnData
    }

    returnData.data = accountsData.data;
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

const getAccountById = async req => {
  const userId = req.user.id;
  const accountId = req.params.accountId

  try {
    const accountData = await AccountModel.getAccountById(userId, accountId);
    returnData.status = accountData.status;
    if(accountData.status.code !== 200) {
      return returnData
    }

    returnData.data = accountData.data;
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
}

const AccountService = {
  getAccessToken: getAccessToken,
  getAccounts: getAccounts,
  getAccountById: getAccountById
};

export default AccountService;
