import SignupModel from "../models/signupModel";

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
  
  return userData
};

const SignupService = {
  submit: submit,
  authenticate: authenticate
};

export default SignupService;
