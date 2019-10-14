import { Connection } from "../loaders/mysql";
import { Plaid } from "../loaders/plaid";

const returnData = {};

const getAccessToken = req => {
  const data = req.body;
  const publicToken = data.publicToken;

  return new Promise((res, rej) => {
    Plaid().exchangePublicToken(publicToken, (error, tokenResponse) => {
      if (error != null) {
        console.log("Could not exchange public_token!" + "\n" + error);
        returnData.status = {
          code: 500,
          error: error,
          message: `Error with the Plaid Link State!`
        };
        rej(returnData);
      }
      returnData.status = {
        code: 200,
        error: ``,
        message: ``
      };
      returnData.data = tokenResponse;
      res(returnData);
    });
  });
};

const getAccountDetails = plaidResponseData => {
  const accessToken = plaidResponseData.access_token;

  return new Promise((res, rej) => {
    Plaid().getAccounts(accessToken, (error, result) => {
      if (error != null) {
        console.log("Could not get account details" + "\n" + error);
        returnData.status = {
          code: 500,
          error: error,
          message: `Error with the Plaid Link Account!`
        };
        rej(returnData);
      }
      returnData.status = {
        code: 200,
        error: ``,
        message: ``
      };
      returnData.data = result;
      res(returnData);
    });
  });
};

const PlaidModel = {
  getAccessToken: getAccessToken,
  getAccountDetails: getAccountDetails
};

export default PlaidModel;
