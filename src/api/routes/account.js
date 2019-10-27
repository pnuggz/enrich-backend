import { Router } from "express"

import middlewares from "./middlewares/index.js"
const basiqAuth = middlewares.basiqAuth;
const isAuth = middlewares.isAuth;
const renewToken = middlewares.renewToken;

import UserService from "../../services/userService"
import BasiqService from "../../services/basiqService.js"

const AccountRouter = app => {
  const route = Router();

  app.use("/account", route);

  route.get("/institution/:basiqInstitutionId", isAuth, renewToken, basiqAuth, async (req, res) => {
    const returnData = req.returnData
    const basiqInstitutionId = req.params.basiqInstitutionId

    const userBasiqDataResponse = await UserService.getUserBasiqData(req)
    if (userBasiqDataResponse.status.code !== 200) {
      returnData.status = userBasiqDataResponse.status;
      res.status(userBasiqDataResponse.status.code).json(returnData);
    }

    const userBasiqId = userBasiqDataResponse.data[0].basiq_id
    const userBasiqAccountsResponse = await BasiqService.getAccountsByInstitution(req, userBasiqId, basiqInstitutionId)
    if (userBasiqAccountsResponse.status.code !== 200) {
      returnData.status = userBasiqAccountsResponse.status
      res.status(userBasiqAccountsResponse.status.code).json(returnData)
    }

    returnData.data = {
      accounts: userBasiqAccountsResponse.data
    };
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  })

  route.get("/institution/:basiqInstitutionId/user", isAuth, renewToken, basiqAuth, async (req, res) => {
    const returnData = req.returnData

    const userBasiqAccountsResponse = await UserService.getUserBasiqAccounts(req)
    if (userBasiqAccountsResponse.status.code !== 200) {
      returnData.status = userBasiqAccountsResponse.status
      res.status(userBasiqAccountsResponse.status.code).json(returnData)
    }

    returnData.data = {
      accounts: userBasiqAccountsResponse.data
    };
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  })

  route.post("/", isAuth, renewToken, basiqAuth, async (req, res) => {
    const returnData = req.returnData

    const userBasiqAccountsResponse = await UserService.saveUserBasiqAccounts(req)
    if (userBasiqAccountsResponse.status.code !== 200) {
      returnData.status = userBasiqAccountsResponse.status
      res.status(userBasiqAccountsResponse.status.code).json(returnData)
    }

    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  })

};

module.exports = AccountRouter;
