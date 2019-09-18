import LoginModel from "../models/loginModel";
import TokenModel from "../models/tokenModel";

const submit = async req => {
  const userData = await LoginModel.validate(req);
  const userDataStatusCode = userData.status.code;

  if (userDataStatusCode === 500 || userDataStatusCode === 401) {
    return userData;
  }

  const token = await TokenModel.generateToken(req, userData);
  userData.token = token;

  return userData;
};

const LoginService = {
  submit: submit
};

export default LoginService;
