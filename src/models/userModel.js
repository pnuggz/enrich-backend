import { Connection } from "../loaders/mysql";

const get = async () => {
  const queryString = "SELECT * FROM USERS";

  try {
    let [rows, fields] = await Connection().query(queryString);
    return rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

const linkPlaidAccount = async (userData, plaidData) => {
  const userId = userData.id;
  const accountData = plaidData.accountData;

  console.log(accountData);

  try {
    const queryString1 = `INSERT INTO plaid (access_token, item_id) VALUES ("${plaidData.access_token}", "${plaidData.item_id}")`;
    const [rows1, fields1] = await Connection().query(queryString1);
    const plaidId = rows1.insertId;

    const queryString2 = `INSERT INTO users_has_plaid (user_id, plaid_id) VALUES(${userId}, ${plaidId})`;
    const [rows2, fields2] = await Connection().query(queryString2);

    for (let i = 0; i < accountData.accounts.length; i++) {
      const account = accountData.accounts[i];
      const balances = account.balances;
      const queryString3 = `INSERT INTO plaid_accounts (plaid_id, account_id, name, official_name, type, subtype) VALUES (${plaidId}, "${account.account_id}", "${account.name}", "${account.official_name}", "${account.type}", "${account.subtype}")`;
      const [rows3, fields3] = await Connection().query(queryString3);

      console.log(balances);
    }
  } catch (err) {
    console.log(err);
  }
};

const UserModel = {
  linkPlaidAccount: linkPlaidAccount
};

export default UserModel;
