import { Router } from "express";

import UserService from "../../services/userService";

const UserRouter = app => {
  const route = Router();

  app.use("/users", route);

  route.get(
    "/",
    isAuth(),
    renewToken(),
    // ADD MIDDLEWARE VALIDATOR HERE,
    async (req, res) => {
      const userData = await UserService.get()
      const userDataStatusCode = userData.status.code

      if(userDataStatusCode === 500 || userDataStatusCode === 401) {
        return res.status(userDataStatusCode).json(userDataStatusCode)
      }

      return res.json(userData)
    }
  )

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
