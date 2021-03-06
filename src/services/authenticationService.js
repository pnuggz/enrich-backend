import TokenModel from "../models/tokenModel";
import UserModel from "../models/userModel"

const authenticate = async req => {
  const returnData = {};
  try {
    const auth = await TokenModel.checkToken(req);

    if (auth.verified) {
      const userId = auth.userId
      const email = auth.email

      const token = await TokenModel.generateToken(req, { user: { id: userId, email: email } })
      const user = await UserModel.getUserFromToken(userId)

      req.user = user[0]
      req.token = token.token;
      req.tokenCreatedDate = token.createdDate;
      returnData.status = {
        code: 200,
        err: ``,
        msg: ``
      };
    } else {
      returnData.status = {
        code: 401,
        err: `Token has expired`,
        msg: `Your session has expired. Please login again.`
      };
    }
    return returnData;
  } catch (err) {
    console.log(err);
    returnData.status = {
      code: 500,
      err: err,
      msg: `Internal server error with the authentication of token.`
    };
    return returnData;
  }
};

const AuthenticationService = {
  authenticate: authenticate
};

export default AuthenticationService;
