import { Router } from "express";

import UserService from "../../services/userService";

import middlewares from "./middlewares/index";
import AuthenticationService from "../../services/authenticationService";

const UserRouter = app => {
  const route = Router();
  const isAuth = middlewares.isAuth;
  const renewToken = middlewares.renewToken;

  app.use("/users", route);

  route.get(
    "/",
    isAuth,
    renewToken,
    // ADD MIDDLEWARE VALIDATOR HERE,
    async (req, res) => {
      const userData = await UserService.get();
      const userDataStatusCode = userData.status.code;

      if (userDataStatusCode === 500 || userDataStatusCode === 401) {
        return res.status(userDataStatusCode).json(userDataStatusCode);
      }

      return res.json(userData);
    }
  );

  route.post(
    "/authenticate",
    // ADD MIDDLEWARE HERE
    async (req, res) => {
      console.log(req.body);
      req.token = req.body.token;
      const authentication = await AuthenticationService.authenticate(req);

      console.log(authentication);
      if (!authentication) {
        const data = {
          status: {
            code: 401,
            err: "Bad authorisation",
            message: "Token has expired."
          }
        };
        res.status(401).json(data);
      }

      const data = {
        status: {
          code: 200,
          err: "",
          message: "Token is authenticated"
        }
      };
      res.status(200).json(data);
    }
  );

  route.get(
    "/me",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      // res.json("HERE");
      const user = await UserService.test();
      res.json(user);
    }
  );
};

export default UserRouter;
