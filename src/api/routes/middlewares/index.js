import isAuth from "./isAuth.js"
import renewToken from "./renewToken.js"
import basiqAuth from "./basiqAuth.js"

const middlewares = {
  isAuth: isAuth,
  renewToken: renewToken,
  basiqAuth: basiqAuth
};

export default middlewares;
