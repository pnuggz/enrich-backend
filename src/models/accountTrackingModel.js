import { format } from "date-fns";

import { Connection } from "../loaders/mysql";
import { authorize, defaultUnauthMsg } from "../library/authorization";

const returnData = {};

const createAccountTracking = async (accountsData, req) => {
  const selectedAccountsData = req.body;
  const selectedAccounts = selectedAccountsData.selectedAccounts;

  const month = format(new Date(), "M");
  try {
    for (let i = 0; i < accountsData.length; i++) {
      const account = accountsData[i];
      const accountId = account.id;
      const plaidAcountId = account.plaid_account_id;

      const trackingSettings = selectedAccounts.reduce((result, accountRow) => {
        if (accountRow.account_id == plaidAcountId) {
          return accountRow.settings;
        }
        return result;
      }, null);

      if (trackingSettings === null) {
        returnData.status = {
          code: 500,
          error: err,
          msg: `Error with getting the accounts from the db.`
        };
        return returnData;
      }

      const trackingType = trackingSettings.type;
      const includeDollar = trackingSettings.include_dollar;
      const monthlyLimit = trackingSettings.limit;

      const queryString1 = `
        INSERT INTO tracking_accounts (plaid_account_id, tracking_type, include_dollar, monthly_limit) 
        VALUES (${accountId}, ${trackingType}, ${includeDollar}, ${monthlyLimit})
        ON DUPLICATE KEY UPDATE plaid_account_id='${accountId}'`;
      const [rows1, fields1] = await Connection().query(queryString1);
      const trackingAccountId = rows1.insertId;

      if (trackingAccountId === 0) {
        i++;
      }

      const queryString2 = `
        INSERT INTO tracking_accounts_balance (tracking_account_id, balance, month) 
        VALUES (${trackingAccountId}, 0, ${month})
        ON DUPLICATE KEY UPDATE tracking_account_id='${trackingAccountId}'`;
      const [rows2, fields2] = await Connection().query(queryString2);
    }

    returnData.status = {
      code: 200,
      error: ``,
      msg: ``
    };
    return returnData;
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      error: err,
      msg: `Error with getting the accounts from the db.`
    };
    return returnData;
  }
};

const AccountTrackingModel = {
  createAccountTracking: createAccountTracking
};

module.exports = AccountTrackingModel;
