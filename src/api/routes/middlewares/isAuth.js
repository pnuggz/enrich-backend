import AuthenticationService from "../../../services/authenticationService";

const getTokenFromHeader = req => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const isAuth = (req, res, next) => {
  const token = getTokenFromHeader(req);
  req.token = token;
  const verification = AuthenticationService.authenticate(req);

  if (verification) {
    req.tokenAuthentication = true;
    next();
  } else {
    req.tokenAuthentication = false;
    const data = {
      status: {
        code: 401,
        err: "Bad authorisation",
        message: "Token has expired."
      }
    };
    res.status(401).json(data);
  }
};

export default isAuth;
