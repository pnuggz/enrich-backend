const path = require("path")

const Connection = require(path.join(__dirname, "../loaders/mysql.js"))

const Authorization = require(path.join(__dirname, "../library/authorization"))

const returnData = {};

const getAccountsByUser = async (userId) => {
  const queryString1 = `
    SELECT 
    users_basiq_accounts.*,
    users_basiq_accounts.user_id as userId
    FROM users_basiq_accounts
    WHERE users_basiq_accounts.user_id = ?
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId])

    if (!Authorization.authorize(results, userId)) {
      returnData.status = Authorization.defaultUnauthMsg();
      return (returnData);
    }

    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    };
    returnData.data = results;
    return (returnData);
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
};

const AccountModel = {
  getAccountsByUser: getAccountsByUser,
};

module.exports = AccountModel;