import { Connection } from "../loaders/mysql";
import hash from "string-hash";
import crypto from "crypto-random-string";

const create = async req => {
  const returnData = {}

  const data = req.body;
  const username = data.username.value;
  const email = data.email.value;
  const password = data.password.value;
  const password_salt = data.password_salt.value;

  try {
    // Create the user
    const queryString1 = `
      INSERT INTO users (username, email, password, password_salt) 
      VALUES ("${username}", "${email}", "${password}", "${password_salt}")`;
    const [rows1, fields1] = await Connection().query(queryString1);

    const queryString2 = `
      SELECT users.id,
      users.username,
      users.email,
      users.is_active
      FROM users 
      WHERE users.id = ${rows1.insertId}`;
    const [rows2, fields2] = await Connection().query(queryString2);

    // Create the verification
    const verification_token = hash(rows2[0].username) + crypto({ length: 16 });
    const queryString3 = `
      INSERT INTO users_verification (user_id, verification_token) 
      VALUES (${rows2[0].id}, "${verification_token}")`;
    const [rows3, fields3] = await Connection().query(queryString3);

    const queryString4 = `
      SELECT * 
      FROM users_verification 
      WHERE users_verification.id = ${rows3.insertId}`;
    const [rows4, fields4] = await Connection().query(queryString4);

    returnData.data = {
      user: rows2[0],
      verification: rows4[0]
    }
    returnData.status = {
      code: 200,
      error: ``,
      message: `Account has been successfully created. An email has been sent to verify and activate your account.`
    }
    return returnData
  } catch (err) {
    console.log(err);
    returnData.status = {
      status: 500,
      error: err,
      message: `Internal error with creation of the user in the database.`
    }
    return returnData
  }
};

const authenticate = async req => {
  const returnData = {}
  const verificationToken = req.params.verificationToken;

  try {
    const queryString1 = `
      UPDATE users_verification 
      SET users_verification.is_verified = 1 
      WHERE users_verification.verification_token = "${verificationToken}"`;
    const [rows1, fields1] = await Connection().query(queryString1);

    const queryString2 = `
      SELECT users.id,
      users.username,
      users.email,
      users.is_active
      FROM users 
      JOIN users_verification ON users.id = users_verification.user_id
      WHERE users_verification.verification_token = "${verificationToken}"`;
    const [rows2, fields2] = await Connection().query(queryString2);

    returnData.data = {
      user: rows2[0]
    }
    returnData.status = {
      code: 200,
      error: ``,
      message: `Account has been been activated.`
    }
    return returnData
  } catch (err) {
    console.log(err);
    returnData.status = {
      status: 500,
      error: err,
      message: `Internal error with verification of the user in the database.`
    }
    return returnData
  }
};

const UserModel = {
  create: create,
  authenticate: authenticate
};

export default UserModel;
