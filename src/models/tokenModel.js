import jwt from "jsonwebtoken"

import config from "../config/index"

const jwtConfig = config.jwt;

const generateToken = (req, userData) => {
  const privateKey = jwtConfig.privateKey;

  const issuer = jwtConfig.issuer;
  const audience = jwtConfig.audience;
  const userId = userData.user.id
  const email = userData.user.email;

  const payload = {
    userId: userId
  };

  const signOptions = {
    issuer: issuer,
    subject: email,
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

  const verifyOptions = {
    issuer: issuer,
    audience: audience,
    expiresIn: 2100,
    algorithm: ["RS256"]
  };

  try {
    const verify = jwt.verify(token, publicKey, verifyOptions);
    return {
      verified: true,
      error: ``,
      userId: verify.userId,
      email: verify.sub
    };
  } catch (err) {
    console.log(err);
    return {
      verified: false,
      error: err,
      userId: ``,
      email: ``
    };
  }
};

const TokenModel = {
  generateToken: generateToken,
  checkToken: checkToken
};

export default TokenModel;
