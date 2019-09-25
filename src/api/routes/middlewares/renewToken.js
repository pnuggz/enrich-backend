const renewToken = (req, res, next) => {
  const returnData = {
    token: req.token,
    tokenCreatedDate: req.tokenCreatedDate
  };
  req.returnData = returnData;
  next();
};

export default renewToken;
