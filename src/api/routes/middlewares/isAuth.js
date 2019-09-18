import config from '../../../config';

const getTokenFromHeader = req => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const isAuth = (req, res, next) => {
  const verification = getTokenFromHeader(req)
  if(verification) {
    req.tokenAuthentication = true
    next()
  } else {
    req.tokenAuthentication = false
    next()
  }
}

export default isAuth