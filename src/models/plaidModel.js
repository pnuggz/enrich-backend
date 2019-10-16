import dateFns from "date-fns";

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

const getAccountDetails = plaidData => {
  const accessToken = plaidData.access_token;

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

const getTransactions = (plaidData, date1 = null, date2 = null, offset = 0) => {
  const accessToken = plaidData.access_token;
  const startDate =
    dateFns.format(date1, "yyyy-M-d") ||
    dateFns.format(dateFns.startOfMonth(new Date()), "yyyy-M-d");
  const endDate =
    dateFns.format(date2, "yyyy-M-d") || dateFns.format(new Date(), "yyyy-M-d");

  return new Promise((res, rej) => {
    Plaid().getTransactions(
      accessToken,
      startDate,
      endDate,
      {
        count: 250,
        offset: offset
      },
      (error, result) => {
        if (error != null) {
          console.log("Could not get account transactions" + "\n" + error);
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
      }
    );
  });
};

const PlaidModel = {
  getAccessToken: getAccessToken,
  getAccountDetails: getAccountDetails,
  getTransactions: getTransactions
};

export default PlaidModel;
