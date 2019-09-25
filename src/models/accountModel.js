import { Connection } from "../loaders/mysql";

const getAll = async userId => {
  const returnData = {};

  try {
    const queryString1 = `SELECT plaid_accounts.id, plaid_accounts.institution, plaid_accounts.name, plaid_accounts.official_name, plaid_accounts.type, plaid_accounts.subtype, plaid_accounts.plaid_id, plaid_accounts.official_name FROM plaid_accounts JOIN users_has_plaid ON users_has_plaid.plaid_id = plaid_accounts.plaid_id WHERE users_has_plaid.user_id = ${userId}`;
    const [rows1, fields1] = await Connection().query(queryString1);
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

const AccountModel = {
  getAll: getAll
};

export default AccountModel;