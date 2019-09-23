import { Router } from "express";

import AccountService from "../../services/accountService";
import UserService from "../../services/userService";

const AccountRouter = app => {
  const route = Router();

  app.use("/account", route);

  route.post("/token", async (req, res) => {
    const plaidData = await AccountService.getAccessToken(req);
    const plaidDataStatusCode = plaidData.status.code;
    if (plaidDataStatusCode === 500) {
      res.status(plaidDataStatusCode).json(plaidData);
    }

    const userData = await UserService.linkPlaidAccount(req, plaidData);
    const userDataStatusCode = userData.status.code;
    if (userDataStatusCode === 500) {
      res.status(userDataStatusCode).json(userData);
      return;
    }

    res.json(userData);
  });
};

export default AccountRouter;
