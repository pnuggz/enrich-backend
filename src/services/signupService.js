import SignupModel from "../models/signupModel";
import TokenModel from "../models/tokenModel";

const submit = async req => {
  const userData = await SignupModel.create(req);
  return userData;
};

const authenticate = async req => {
  const userData = await SignupModel.authenticate(req);
  const userDataStatusCode = userData.status.code

  if(userDataStatusCode === 500) {
    return userData
  }

  const token = await TokenModel.generateToken(req, userData);

  Object.assign(userData, token)

  return userData
};

const SignupService = {
  submit: submit,
  authenticate: authenticate
};

export default SignupService;
