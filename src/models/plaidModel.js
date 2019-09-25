import { Connection } from "../loaders/mysql";
import { Plaid } from "../loaders/plaid";

const getAccessToken = req => {
  const data = req.body.data;
  const publicToken = data.plaidPublicToken;

  return new Promise((res, rej) => {
    Plaid().exchangePublicToken(publicToken, (error, tokenResponse) => {
      if (error != null) {
        console.log("Could not exchange public_token!" + "\n" + error);
        rej(error);
      }
      res(tokenResponse);
    });
  });
};

const getAccountDetails = plaidData => {
  const accessToken = plaidData.access_token;

  return new Promise((res, rej) => {
    Plaid().getAccounts(accessToken, (error, result) => {
      if (error != null) {
        console.log("Could not get account details" + "\n" + error);
        rej(error);
      }
      res(result);
    });
  });
};

const PlaidModel = {
  getAccessToken: getAccessToken,
  getAccountDetails: getAccountDetails
};

export default PlaidModel;
