import { Connection } from "../loaders/mysql";
import { authorize, defaultUnauthMsg } from "../library/authorization";

const returnData = {};

const getAll = async userId => {
  try {
    const queryString1 = `
      SELECT plaid_accounts.id, 
      plaid_accounts.name, 
      plaid_accounts.official_name, 
      plaid_accounts.type, 
      plaid_accounts.subtype, 
      plaid_accounts.plaid_id, 
      plaid_accounts.official_name,
      plaid.institution,
      plaid.user_id AS userId
      FROM plaid_accounts
      JOIN plaid ON plaid.id = plaid_accounts.plaid_id 
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

const getAccountById = async (userId, accountId) => {
  try {
    const queryString1 = `
      SELECT plaid_accounts.id, 
      plaid_accounts.name, 
      plaid_accounts.official_name, 
      plaid_accounts.type, 
      plaid_accounts.subtype, 
      plaid_accounts.plaid_id, 
      plaid_accounts.official_name,
      plaid.institution,
      plaid.user_id AS userId
      FROM plaid_accounts 
      JOIN plaid ON plaid.id = plaid_accounts.plaid_id
      WHERE plaid.user_id = ${userId} AND 
      plaid_accounts.id = ${accountId}`;
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

const getAccountsByInstitution = async (userId, institution) => {
  const institutionName = institution.name;
  const institutionId = institution.institution_id;

  try {
    const queryString1 = `
      SELECT plaid_accounts.id, 
      plaid_accounts.name, 
      plaid_accounts.official_name, 
      plaid_accounts.type, 
      plaid_accounts.subtype, 
      plaid_accounts.plaid_id, 
      plaid_accounts.official_name,
      plaid_accounts.mask,
      plaid.institution,
      plaid.user_id AS userId
      FROM plaid_accounts 
      JOIN plaid ON plaid.id = plaid_accounts.plaid_id
      WHERE plaid.user_id = ${userId} AND 
      plaid.institution_id = "${institutionId}" AND 
      plaid.institution = "${institutionName}"`;
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

const submitAccounts = async (userId, req) => {
  const selectedAccountsData = req.body;
  const selectedAccounts = selectedAccountsData.selectedAccounts;
  const institutionName = selectedAccountsData.plaidData.institution.name;
  const institutionId =
    selectedAccountsData.plaidData.institution.institution_id;
  const accessToken = selectedAccountsData.plaidData.accessToken;
  const itemId = selectedAccountsData.plaidData.itemId;

  try {
    const queryString1 = `
      SELECT plaid.id, 
      plaid.user_id AS userId
      FROM plaid 
      WHERE plaid.user_id = ${userId} AND 
      plaid.institution_id = "${institutionId}" AND 
      plaid.institution = "${institutionName}"`;
    const [rows1, fields1] = await Connection().query(queryString1);
    let plaidId = null;

    if (rows1.length > 0) {
      if (!(await authorize(rows1, userId))) {
        returnData.status = defaultUnauthMsg();
        return returnData;
      }
      plaidId = rows1[0].id;
    } else {
      const queryString2 = `
      INSERT INTO plaid (user_id, access_token, item_id, institution_id, institution) 
      VALUES (${userId}, "${accessToken}", "${itemId}", "${institutionId}", "${institutionName}")`;
      const [rows2, fields2] = await Connection().query(queryString2);
      plaidId = rows2.insertId;
    }

    for (let i = 0; i < selectedAccounts.length; i++) {
      const account = selectedAccounts[i];
      const balances = account.balances;
      const queryString3 = `
        INSERT INTO plaid_accounts (plaid_id, account_id, name, official_name, type, subtype, mask) 
        VALUES (${plaidId}, "${account.account_id}", "${account.name}", "${account.official_name}", "${account.type}", "${account.subtype}", "${account.mask}")`;
      const [rows3, fields3] = await Connection().query(queryString3);
      const accountId = rows3.insertId;

      const queryString4 = `
        INSERT INTO plaid_accounts_balance (plaid_accounts_id, balance_available, balance_current, balance_limit, iso_currency_code) 
        VALUES (${accountId}, ${balances.available}, ${balances.current}, ${balances.limit}, "${balances.is_currency_code}")`;
      const [rows4, fields4] = await Connection().query(queryString4);
    }

    const queryString5 = `
      SELECT plaid_accounts.id, 
      plaid_accounts.account_id as plaid_account_id,
      plaid_accounts.plaid_id, 
      plaid_accounts.name, 
      plaid_accounts.official_name, 
      plaid_accounts.type, 
      plaid_accounts.subtype 
      FROM plaid_accounts
      JOIN plaid ON plaid.id = plaid_accounts.plaid_id
      WHERE plaid.id = ${plaidId} AND
      plaid.user_id = ${userId}`;
    const [rows5, fields5] = await Connection().query(queryString5);

    if (!(await authorize(rows5, userId))) {
      returnData.status = defaultUnauthMsg();
      return returnData;
    }

    returnData.data = rows5;
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

const AccountModel = {
  getAll: getAll,
  getAccountById: getAccountById,
  getAccountsByInstitution: getAccountsByInstitution,
  submitAccounts: submitAccounts
};

export default AccountModel;
