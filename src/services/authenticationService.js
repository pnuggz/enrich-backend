import TokenModel from "../models/tokenModel";

const authenticate = async req => {
  return (verification = await TokenModel.checkToken(req));
};

const AuthenticationService = {
  authenticate: authenticate
};

export default AuthenticationService;
