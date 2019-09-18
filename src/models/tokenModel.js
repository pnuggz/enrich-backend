import jwt from "jsonwebtoken";

import config from "../config/index";

const jwtConfig = config.jwt;

// DUMMY PAYLOAD
const payload = {};

const generateToken = (req, userData) => {
  const privateKey = jwtConfig.privateKey;

  const issuer = jwtConfig.issuer;
  const audience = jwtConfig.audience;
  const subject = userData.user.email;

  const signOptions = {
    issuer: issuer,
    subject: subject,
    audience: audience,
    expiresIn: "2100",
    algorithm: "RS256"
  };

  const token = jwt.sign(payload, privateKey, signOptions);
  return token;
};

const checkToken = req => {
  const publicKey = jwtConfig.publicKey;
  const token = req.token;

  const issuer = jwtConfig.issuer;
  const audience = jwtConfig.audience;
  const subject = req.userData.user.email;

  const verifyOptions = {
    issuer: issuer,
    subject: subject,
    audience: audience,
    expiresIn: "2100",
    algorithm: ["RS256"]
  };

  const verify = jwt.verify(token, publicKey, verifyOptions);

  return verify;
};

const TokenModel = {
  generateToken: generateToken,
  checkToken: checkToken
};

export default TokenModel;
