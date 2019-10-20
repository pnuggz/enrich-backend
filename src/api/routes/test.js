import { Router } from "express"

import middlewares from "./middlewares/index.js"
const basiqAuth = middlewares.basiqAuth;

import BasiqService from "../../services/basiqService.js"
import InstitutionService from "../../services/institutionService.js"

import workerJobs from "../../jobs"

const returnData = {};

const TestRouter = app => {
  const route = Router();

  app.use("/test", route);

  route.get("/", basiqAuth, async (req, res) => {
    // const basiqResponse = await BasiqService.getAccounts(
    //   req,
    //   "012e2aef-7883-4b22-9b3b-b1bc4897476e"
    // );

    // const basiqResponse = await BasiqService.getInstitutions(req);
    // InstitutionService.saveInstitutions(basiqResponse.data.data);

    const loginData = {
      login: "gavinBelson",
      password: "hooli2016"
    };
    const userId = "012e2aef-7883-4b22-9b3b-b1bc4897476e";
    const institutionId = "AU00000";
    const accountId = "6d1c929b-befb-4f33-8a0c-7c7ed7c147a4";
    const basiqResponse = await BasiqService.getTransactionsByAccount(
      req,
      userId,
      accountId
    );
    returnData.data = basiqResponse;

    returnData.status = 200;
    res.json(returnData);
  });
};

export default TestRouter;
