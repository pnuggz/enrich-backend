import { Router } from "express";

import UserService from "../../services/userService";

import middlewares from "./middlewares/index";
import AuthenticationService from "../../services/authenticationService";

const UserRouter = app => {
  const route = Router();
  const isAuth = middlewares.isAuth;
  const renewToken = middlewares.renewToken;

  app.use("/users", route);

  route.get("/", isAuth, renewToken, async (req, res) => {
    const userData = await UserService.get();
    const userDataStatusCode = userData.status.code;

    if (userDataStatusCode === 500 || userDataStatusCode === 401) {
      res.status(userDataStatusCode).json(userDataStatusCode);
      return;
    }

    res.json(userData);
  });

  route.post(
    "/authenticate",
    // ADD MIDDLEWARE HERE
    async (req, res) => {
      const authentication = await AuthenticationService.authenticate(req);

      if (!authentication) {
        const badData = {
          status: {
            code: 401,
            err: "Bad authorisation",
            message: "Token has expired."
          }
        };
        res.status(401).json(badData);
        return;
      }

      const data = {
        status: {
          code: 200,
          err: "",
          message: "Token is authenticated"
        },
        user: req.body.user,
        token: req.token
      };

      res.json(data);
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
