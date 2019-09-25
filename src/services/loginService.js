import LoginModel from "../models/loginModel";
import TokenModel from "../models/tokenModel";

const submit = async req => {
  const returnData = {};

  try {
    const userData = await LoginModel.validate(req);
    const user = userData.data;
    const userDataStatusCode = userData.status.code;
    if (userDataStatusCode === 500 || userDataStatusCode === 401) {
      returnData.status = userData.status;
      return returnData;
    }

    const token = await TokenModel.generateToken(req, user);

    returnData.data = userData.data;
    returnData.token = token.token;
    returnData.tokenCreatedDate = token.createdDate;
    returnData.status = userData.status;
    return returnData;
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      error: err,
      msg: `Internal server error with validation of the user.`
    };
  }
};

const LoginService = {
  submit: submit
};

export default LoginService;
