import jwt from "jsonwebtoken";

import config from "../config/index";

const jwtConfig = config.jwt;

// DUMMY PAYLOAD
const payload = {};

const generateToken = (req, userData = null) => {
  const privateKey = jwtConfig.privateKey;

  const issuer = jwtConfig.issuer;
  const audience = jwtConfig.audience;
  const subject = userData === null ? req.headers.subject : userData.user.email;

  const signOptions = {
    issuer: issuer,
    subject: subject,
    audience: audience,
    expiresIn: 2100,
    algorithm: "RS256"
  };

  const token = {
    token: jwt.sign(payload, privateKey, signOptions),
    createdDate: new Date()
  };
  return token;
};

const checkToken = req => {
  const publicKey = jwtConfig.publicKey;
  const token = req.token;

  const issuer = jwtConfig.issuer;
  const audience = jwtConfig.audience;
  const subject = req.headers.subject;

  const verifyOptions = {
    issuer: issuer,
    subject: subject,
    audience: audience,
    expiresIn: 2100,
    algorithm: ["RS256"]
  };

  try {
    const verify = jwt.verify(token, publicKey, verifyOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const TokenModel = {
  generateToken: generateToken,
  checkToken: checkToken
};

export default TokenModel;
