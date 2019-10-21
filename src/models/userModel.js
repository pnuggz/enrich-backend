import hash from "string-hash"
import crypto from "crypto-random-string"

import Connection from "../loaders/mysql"

import Authorization from "../library/authorization"

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

const getUserBasiqAccount = async userId => {
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

const UserModel = {
  getUserFromToken: getUserFromToken,
  createUser: createUser,
  getUser: getUser,
  getUserByLoginIncPassword: getUserByLoginIncPassword,
  createVerificationToken: createVerificationToken,
  getVerificationTokenByUser: getVerificationTokenByUser,
  getUserBasiqAccount: getUserBasiqAccount,
  linkUserBasiqAccount: linkUserBasiqAccount
};

export default UserModel;
