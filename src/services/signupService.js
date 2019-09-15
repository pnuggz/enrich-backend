import SignupModel from "../models/signupModel";
import TokenModel from "../models/tokenModel";

const submit = async req => {
  const userData = await SignupModel.create(req);
  return userData;
};

const authenticate = async req => {
  const userData = await SignupModel.authenticate(req);
  const token = await TokenModel.generateToken(req, userData);

  return {
    user: userData,
    token: token
  };
};

const SignupService = {
  submit: submit,
  authenticate: authenticate
};

export default SignupService;
