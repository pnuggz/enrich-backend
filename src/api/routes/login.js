import { Router } from "express";

import LoginService from "../../services/loginService";

const LoginRouter = app => {
  const route = Router();

  app.use("/login", route);

  route.post("/", async (req, res) => {
    const returnData = {};

    const userData = await LoginService.submit(req);
    const userDataStatusCode = userData.status.code;
    if (userDataStatusCode === 500 || userDataStatusCode === 401) {
      returnData.status = userData.status;
      res.status(userDataStatusCode).json(returnData);
      return;
    }

    returnData.data = {
      user: userData.data
    };
    returnData.status = userData.status;
    res.json(userData);
  });
};

export default LoginRouter;
