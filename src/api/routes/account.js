import { Router } from "express";

import middlewares from "./middlewares/index";
import AccountService from "../../services/accountService";

const AccountRouter = app => {
  const route = Router();
  const isAuth = middlewares.isAuth;
  const renewToken = middlewares.renewToken;

  app.use("/account", route);

  route.get("/", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData;

    const accountsData = await AccountService.getAccounts(req);
    const accountsDataStatusCode = accountsData.status.code;
    if (accountsDataStatusCode !== 200) {
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

  route.post("/", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData;

    const accountsData = await AccountService.submitAccounts(req);
    const accountsDataStatusCode = accountsData.status.code;
    if (accountsDataStatusCode !== 200) {
      returnData.status = accountsData.status;
      res.status(accountsDataStatusCode).json(returnData);
    }

    returnData.data = accountsData.data;
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  });

  route.get("/:accountId", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData;

    const accountsData = await AccountService.getAccountById(req);
    const accountsDataStatusCode = accountsData.status.code;
    if (accountsDataStatusCode !== 200) {
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
    if (plaidDataStatusCode !== 200) {
      returnData.status = plaidData.status;
      res.status(plaidDataStatusCode).json(returnData);
    }

    returnData.data = plaidData.data;
    returnData.status = plaidData.status;
    res.json(returnData);
  });

  route.post("/link", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData;

    const linkAccount = await AccountService.LinkAccount(req);
  });
};

export default AccountRouter;
