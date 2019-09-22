import { Connection } from "../loaders/mysql";
import { Plaid } from "../loaders/mysql";

const getAccessToken = async req => {
  const data = req.body;
  const publicToken = data.plaidPublicToken

  try {
    const tokenResponse = new Promise((res,rej) => {
      Plaid.exchangePublicToken(publicToken, function(error, tokenResponse) {
        if (error != null) {
          console.log('Could not exchange public_token!' + '\n' + error);
          return rej(error)
        }
        res(tokenResponse)
      })
    })

    data.status = {
      code: 200,
      error: ``,
      message: ``
    }

    data.plaidData = {
      accessToken: tokenResponse.access_token,
      itemId: tokenResponse.item_id
    }

    return data
  } catch(err) {
    console.log(err);
    data.status = {
      code: 500,
      error: `err`,
      message: `Internal error with the exchange process.`
    }
    return data
  }
}

const PlaidModel = {
  getAccessToken: getAccessToken
};

export default PlaidModel;
