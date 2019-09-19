import TokenModel from "../models/tokenModel";

const authenticate = async req => {
  const userData = {
    user: req.body.user
  };
  req.userData = userData;
  req.token = req.body.token;

  const auth = await TokenModel.checkToken(req);

  if (auth) {
    const token = await TokenModel.generateToken(req, userData);
    req.token = token.token;
    req.tokenCreatedDate = token.createdDate;
  }

  return auth;
};

const AuthenticationService = {
  authenticate: authenticate
};

export default AuthenticationService;
