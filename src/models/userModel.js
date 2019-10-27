const path = require("path")
const hash = require("string-hash")
const crypto = require("crypto-random-string")

const dateFnsFormat = require("date-fns/format")
const dateFns = {
  format: dateFnsFormat
}

const Connection = require(path.join(__dirname, "../loaders/mysql"))

const Authorization = require(path.join(__dirname, "../library/authorization"))

const returnData = {};

const createUser = async req => {
  const data = req.body;
  const username = data.username.value;
  const email = data.email.value;
  const password = data.password.value;
  const password_salt = data.password_salt.value;

  const queryString1 = `
    INSERT INTO users (username, email, password, password_salt) 
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [username, email, password, password_salt])
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
}

const getUser = async userId => {
  const queryString1 = `
    SELECT 
    users.id,
    users.id as userId,
    users.username,
    users.email,
    users.is_active
    FROM users 
    WHERE users.id = ?`;

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
}

const getUserByLoginIncPassword = async login => {
  const queryString1 = `
    SELECT 
    users.id,
    users.id as userId,
    users.username,
    users.email,
    users.password,
    users.password_salt,
    users.is_active
    FROM users 
    WHERE users.username = ? OR users.email = ?`;

  try {
    const [results, fields] = await Connection.query(queryString1, [login, login])
    const userId = results[0].userId

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
    return returnData
  }
}

const createVerificationToken = async (userId, username) => {
  const verificationToken = hash(username) + crypto({ length: 16 });

  const queryString1 = `
    INSERT INTO users_verification (user_id, verification_token) 
    VALUES (?, ?)`;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId, verificationToken])

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
}

const getVerificationTokenByUser = async userId => {
  const queryString1 = `
    SELECT 
    users_verification.*,
    users_verification.user_id as userId
    FROM users_verification 
    WHERE users_verification.user_id = ?`;

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
}

const getUserFromToken = async userId => {
  const queryString1 = `
    SELECT users.id, 
    users.email, 
    users.username 
    FROM users 
    WHERE users.id = ?`;

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
}

const getUserBasiqData = async userId => {
  const queryString1 = `
    SELECT users_basiq.user_id, 
    users_basiq.user_id as userId ,
    users_basiq.basiq_id
    FROM users_basiq 
    WHERE users_basiq.user_id = ?`;

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
}

const getUserBasiqAccounts = async userId => {
  const queryString1 = `
    SELECT 
    users_basiq_accounts.*,
    users_basiq_accounts.user_id as userId 
    FROM users_basiq_accounts
    WHERE users_basiq_accounts.user_id = ?`;

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
}

const saveUserBasiqAccounts = async (userId, institutionId, accounts) => {
  const queryString1 = `
    INSERT INTO users_basiq_accounts
    (
      user_id,
      institution_id,
      basiq_account_id,
      account_number,
      name,
      type,
      product,
      basiq_status,
      active
    )
    VALUES 
    (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
    ON DUPLICATE KEY UPDATE user_id = ?
  `;

  const queryString2 = `
    INSERT INTO accounts_tracking
    (
      account_id,
      tracking_type,
      include_dollar,
      monthly_limit
    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?
    )
    ON DUPLICATE KEY UPDATE account_id = ?
  `;

  const queryString3 = `
    INSERT INTO accounts_tracking_monthly 
    (
      account_tracking_id, 
      balance, 
      month
    ) 
    VALUES 
    (
      ?,
      ?,
      ?
    )
    ON DUPLICATE KEY UPDATE account_tracking_id = ?
  `;

  try {
    await Connection.query('START TRANSACTION')
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i]
      const queryValues1 = [
        userId,
        institutionId,
        account.id,
        account.accountNo,
        account.name,
        account.class.type,
        account.class.product,
        (account.status === "available") ? 1 : 0,
        1,
        userId
      ]

      const [results, fields] = await Connection.query(queryString1, queryValues1)
      const accountId = results.insertId

      const queryValues2 = [
        accountId,
        account.settings.type,
        account.settings.include_dollar,
        account.settings.limit,
        accountId
      ]
      const [results2, fields2] = await Connection.query(queryString2, queryValues2)
      const accountTrackingId = results2.insertId

      const month = dateFns.format(new Date(), "M");
      const queryValues3 = [
        accountTrackingId,
        0,
        month,
        accountTrackingId
      ]

      const [results3, fields3] = await Connection.query(queryString3, queryValues3)
    }
    await Connection.query('COMMIT')

    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    };
    return (returnData);
  } catch (err) {
    Connection.query('ROLLBACK')
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
}

const linkUserBasiqAccount = async (userId, basiqId) => {
  const queryString1 = `
    INSERT INTO users_basiq (user_id, basiq_id) 
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE user_id=?
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId, basiqId, userId])
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
}

const linkUserInstitution = async (userId, institutionId) => {
  const queryString1 = `
    INSERT INTO users_has_institution (user_id, institution_id) 
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE user_id = ?
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId, institutionId, userId])
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
}

const UserModel = {
  getUserFromToken: getUserFromToken,
  createUser: createUser,
  getUser: getUser,
  getUserByLoginIncPassword: getUserByLoginIncPassword,
  createVerificationToken: createVerificationToken,
  getVerificationTokenByUser: getVerificationTokenByUser,
  getUserBasiqData: getUserBasiqData,
  getUserBasiqAccounts: getUserBasiqAccounts,
  saveUserBasiqAccounts: saveUserBasiqAccounts,
  linkUserBasiqAccount: linkUserBasiqAccount,
  linkUserInstitution: linkUserInstitution
};

module.exports = UserModel;
