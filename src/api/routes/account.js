import { Router } from "express"

import middlewares from "./middlewares/index.js"
const basiqAuth = middlewares.basiqAuth;
const isAuth = middlewares.isAuth;
const renewToken = middlewares.renewToken;

import BasiqService from "../../services/basiqService.js"
import InstitutionService from "../../services/institutionService.js"

import workerJobs from "../../jobs"

const returnData = {};

const AccountRouter = app => {
  const route = Router();

  app.use("/account", route);

  route.get("/institution", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData

    const institutionsResponse = await InstitutionService.getInstitutions();
    if (institutionsResponse.status.code !== 200) {
      returnData.status = institutionsResponse.status;
      res.status(institutionsResponse.status.code).json(returnData);
    }

    returnData.data = {
      institutions: institutionsResponse.data
    };
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  })

  route.post("/institution", isAuth, renewToken, basiqAuth, async (req, res) => {
    const returnData = req.returnData

    const linkResponse = UserService.checkOrCreateLink(req)

    // const institutionsResponse = await InstitutionService.getInstitutions();
    // if (institutionsResponse.status.code !== 200) {
    //   returnData.status = institutionsResponse.status;
    //   res.status(institutionsResponse.status.code).json(returnData);
    // }

    // returnData.data = {
    //   institutions: institutionsResponse.data
    // };
    // returnData.status = {
    //   code: 200,
    //   err: ``,
    //   msg: ``
    // };
    // res.json(returnData);
  })

  // route.get("/", isAuth, renewToken, async (req, res) => {
  //   const returnData = req.returnData;

  //   const accountsData = await AccountService.getAccounts(req);
  //   const accountsDataStatusCode = accountsData.status.code;
  //   if (accountsDataStatusCode !== 200) {
  //     returnData.status = accountsData.status;
  //     res.status(accountsDataStatusCode).json(returnData);
  //   }

  //   returnData.data = {
  //     accounts: accountsData.data
  //   };
  //   returnData.status = {
  //     code: 200,
  //     err: ``,
  //     msg: ``
  //   };
  //   res.json(returnData);
  // });

  // route.post("/", isAuth, renewToken, async (req, res) => {
  //   const returnData = req.returnData;

  //   const accountsData = await AccountService.submitAccounts(req);
  //   const accountsDataStatusCode = accountsData.status.code;
  //   if (accountsDataStatusCode !== 200) {
  //     returnData.status = accountsData.status;
  //     res.status(accountsDataStatusCode).json(returnData);
  //   }

  //   const accountTrackingData = await AccountTrackingService.createAccountTracking(
  //     req,
  //     accountsData.data
  //   );
  //   if (accountTrackingData.status.code !== 200) {
  //     returnData.status = accountTrackingData.status;
  //     res.status(accountTrackingData.status.code).json(returnData);
  //   }

  //   const userData = {
  //     user: req.user
  //   };
  //   workerJobs.loadTransactions(userData);

  //   returnData.data = accountsData.data;
  //   returnData.status = {
  //     code: 200,
  //     err: ``,
  //     msg: ``
  //   };
  //   res.json(returnData);
  // });

  // route.get("/:accountId", isAuth, renewToken, async (req, res) => {
  //   const returnData = req.returnData;

  //   const accountsData = await AccountService.getAccountById(req);
  //   const accountsDataStatusCode = accountsData.status.code;
  //   if (accountsDataStatusCode !== 200) {
  //     returnData.status = accountsData.status;
  //     res.status(accountsDataStatusCode).json(returnData);
  //   }

  //   returnData.data = {
  //     accounts: accountsData.data
  //   };
  //   returnData.status = {
  //     code: 200,
  //     err: ``,
  //     msg: ``
  //   };
  //   res.json(returnData);
  // });

  // route.post("/token", isAuth, renewToken, async (req, res) => {
  //   const returnData = req.returnData;

  //   const plaidData = await AccountService.getAccessToken(req);
  //   const plaidDataStatusCode = plaidData.status.code;
  //   if (plaidDataStatusCode !== 200) {
  //     returnData.status = plaidData.status;
  //     res.status(plaidDataStatusCode).json(returnData);
  //   }

  //   returnData.data = plaidData.data;
  //   returnData.status = plaidData.status;
  //   res.json(returnData);
  // });
};

module.exports = AccountRouter;
