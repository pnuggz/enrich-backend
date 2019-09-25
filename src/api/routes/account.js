import { Router } from "express";

import middlewares from "./middlewares/index";
import AccountService from "../../services/accountService";
import UserService from "../../services/userService";

const AccountRouter = app => {
  const route = Router();
  const isAuth = middlewares.isAuth;
  const renewToken = middlewares.renewToken;

  app.use("/account", route);

  route.get("/:id", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData;

    const accountsData = await AccountService.getAccounts(req);
    const accountsDataStatusCode = accountsData.status.code;
    if (accountsDataStatusCode === 500) {
      returnData.status = accountsData.status;
      res.status(accountsDataStatusCode).json(returnData);
    }

    returnData.data = {
      accounts: accountsData.data
    };
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  });

  route.post("/token", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData;

    const plaidData = await AccountService.getAccessToken(req);
    const plaidDataStatusCode = plaidData.status.code;
    if (plaidDataStatusCode === 500) {
      returnData.status = plaidData.status;
      res.status(plaidDataStatusCode).json(returnData);
    }

    const userData = await UserService.linkPlaidAccount(req, plaidData);
    const userDataStatusCode = userData.status.code;
    if (userDataStatusCode === 500) {
      returnData.status = userData.status;
      res.status(userDataStatusCode).json(returnData);
      return;
    }

    returnData.data = {
      user: userData.data.user,
      accounts: userData.data.accounts
    };
    returnData.status = userData.status;
    res.json(returnData);
  });
};

export default AccountRouter;
