import { Connection } from "../loaders/mysql";
import bcrypt from "bcryptjs";

const validate = async req => {
  const returnData = {}

  const data = req.body;
  const uniqueLogin = data.uniqueLogin.value;
  const password = data.password.value;

  try {
    const queryString1 = `
      SELECT users.id,
      users.email,
      users.username,
      users.password,
      users.password_salt
      FROM users
      WHERE users.email = "${uniqueLogin}" OR users.username = "${uniqueLogin}"
      LIMIT 1
    `;
    const [rows1, fields1] = await Connection().query(queryString1);

    if (rows1.length === 0) {
      return {
        status: {
          code: 401,
          error: `Bad authorisation`,
          message: `Incorrect login details provided.`
        }
      };
    }

    const dbPassword = rows1[0].password;
    const passwordSalt = rows1[0].password_salt;
    delete rows1[0].password;
    delete rows1[0].password_salt;

    const hashedPassword = await hashPassword(password, passwordSalt);

    if (dbPassword !== hashedPassword) {
      return {
        status: {
          code: 401,
          error: `Bad authorisation`,
          message: `Incorrect login details provided.`
        }
      };
    }

    returnData.status = {
      code: 200,
      error: ``,
      message: `Login successful.`
    }
    returnData.data = {
      user: rows1[0]
    }

    return returnData
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      error: `err`,
      message: `Internal error with the login process.`
    }
    return returnData
  }
};

const hashPassword = (password, passwordSalt) => {
  return new Promise((res, rej) => {
    bcrypt.hash(password, passwordSalt, (err, hash) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      res(hash);
    });
  });
};

const LoginModel = {
  validate: validate
};

export default LoginModel;
