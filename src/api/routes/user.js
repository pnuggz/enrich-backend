import { Router } from "express";

import UserService from "../../services/userService";
import { Connection } from "../../loaders/mysql";

const UserRouter = app => {
  const route = Router();

  app.use("/users", route);

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
