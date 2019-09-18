import isAuth from "./isAuth";
import renewToken from "./renewToken";

const middlewares = {
  isAuth: isAuth,
  renewToken: renewToken
};

export default middlewares;
