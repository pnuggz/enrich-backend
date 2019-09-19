import { Router } from "express";

import LoginService from "../../services/loginService";

const LoginRouter = app => {
  const route = Router();

  app.use("/login", route);

  route.post(
    "/",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      const userData = await LoginService.submit(req);
      const userDataStatusCode = userData.status.code;
      if (userDataStatusCode === 500 || userDataStatusCode === 401) {
        res.status(userDataStatusCode).json(userData);
        return;
      }

      res.json(userData);
    }
  );
};

export default LoginRouter;
