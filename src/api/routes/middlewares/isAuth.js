import AuthenticationService from "../../../services/authenticationService.js"

const getTokenFromHeader = req => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  return new Promise((res, rej) => {
    if (
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Token") ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer")
    ) {
      res(req.headers.authorization.split(" ")[1]);
    }
    rej(null);
  });
};

const isAuth = async (req, res, next) => {
  try {
    const token = await getTokenFromHeader(req);
    req.token = token;
    const verification = await AuthenticationService.authenticate(req);

    const verificationStatusCode = verification.status.code;
    if (verificationStatusCode === 500 || verificationStatusCode === 401) {
      req.tokenAuthentication = false;
      const data = {
        status: {
          code: 401,
          error: "Bad authorisation",
          msg: "Unauthorized."
        }
      };
      res.status(verificationStatusCode).json(data);
    }

    req.tokenAuthentication = true;
    next();
  } catch (err) {
    console.log(err);
    const data = {
      status: {
        code: 401,
        error: err,
        msg: "Token has expired."
      }
    };
    res.status(401).json(data);
  }
};

export default isAuth;
