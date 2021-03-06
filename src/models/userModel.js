import { Connection } from "../loaders/mysql";
import { authorize, defaultUnauthMsg } from "../library/authorization";

const returnData = {};

const getUserFromToken = async userId => {
  const queryString = `
    SELECT users.id, 
    users.email, 
    users.username 
    FROM users 
    WHERE users.id = "${userId}"`;

  try {
    let [rows, fields] = await Connection().query(queryString);
    return rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

const linkPlaidAccount = async (userData, plaidData) => {
  const returnData = {};
  const userId = userData.id;
  const accountData = plaidData.data;
  const institution = plaidData.data.institution;

  try {
    const queryString1 = `
      INSERT INTO plaid (access_token, item_id) 
      VALUES ("${plaidData.access_token}", "${plaidData.item_id}")`;
    const [rows1, fields1] = await Connection().query(queryString1);
    const plaidId = rows1.insertId;

    const queryString2 = `
      INSERT INTO users_has_plaid (user_id, plaid_id) 
      VALUES(${userId}, ${plaidId})`;
    const [rows2, fields2] = await Connection().query(queryString2);

    for (let i = 0; i < accountData.accounts.length; i++) {
      const account = accountData.accounts[i];
      const balances = account.balances;
      const queryString3 = `
        INSERT INTO plaid_accounts (plaid_id, institution_id, institution, account_id, name, official_name, type, subtype, mask) 
        VALUES (${plaidId}, "${institution.institution_id}", "${institution.name}", "${account.account_id}", "${account.name}", "${account.official_name}", "${account.type}", "${account.subtype}", ${account.mask})`;
      const [rows3, fields3] = await Connection().query(queryString3);
      const accountId = rows3.insertId;

      const queryString4 = `
        INSERT INTO plaid_accounts_balance (plaid_accounts_id, balance_available, balance_current, balance_limit, iso_currency_code) 
        VALUES (${accountId}, ${balances.available}, ${balances.current}, ${balances.limit}, "${balances.is_currency_code}")`;
      const [rows4, fields4] = await Connection().query(queryString4);
    }

    const queryString5 = `
      SELECT plaid_accounts.id, 
      plaid_accounts.plaid_id, 
      plaid_accounts.name, 
      plaid_accounts.official_name, 
      plaid_accounts.type, 
      plaid_accounts.subtype 
      FROM plaid_accounts 
      WHERE plaid_accounts.plaid_id = ${plaidId}`;
    const [rows5, fields5] = await Connection().query(queryString5);

    returnData.data = {
      user: userData,
      accounts: rows5
    };
    returnData.status = {
      code: 200,
      error: ``,
      msg: `Account has been successfully linked.`
    };
    return returnData;
  } catch (err) {
    returnData.data = {
      user: userData
    };
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with linking of the Plaid account with the database.`
    };
    return returnData;
  }
};

const getPlaidData = async userId => {
  try {
    const queryString1 = `
      SELECT 
      plaid.id,
      plaid.access_token,
      plaid.created_datetime
      FROM plaid
      WHERE plaid.user_id = ${userId}`;
    const [rows1, fields1] = await Connection().query(queryString1);

    if (!(await authorize(rows1, userId))) {
      returnData.status = defaultUnauthMsg();
      return returnData;
    }

    returnData.data = rows1;
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

const UserModel = {
  getUserFromToken: getUserFromToken,
  linkPlaidAccount: linkPlaidAccount,
  getPlaidData: getPlaidData
};

export default UserModel;
