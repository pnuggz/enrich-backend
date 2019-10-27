const bcrypt = require("bcryptjs")

const hashPassword = (pass, passSalt) => {
  return new Promise((res, rej) => {
    bcrypt.hash(pass, passSalt, (err, hash) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      res(hash);
    });
  });
};

const genPasswordSalt = () => {
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      res(salt);
    });
  });
};

const PasswordEncryption = {
  hashPassword: hashPassword,
  genPasswordSalt: genPasswordSalt
}

module.exports = PasswordEncryption