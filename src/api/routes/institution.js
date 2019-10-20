import { Router } from "express"

import middlewares from "./middlewares/index.js"
const basiqAuth = middlewares.basiqAuth;
const isAuth = middlewares.isAuth;
const renewToken = middlewares.renewToken;

import InstitutionService from "../../services/institutionService.js"
import UserService from "../../services/userService.js"

import workerJobs from "../../jobs"

const returnData = {};

const InstitutionRouter = app => {
  const route = Router();

  app.use("/institution", route);

  route.get("/all", isAuth, renewToken, async (req, res) => {
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

  route.get("/user", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData

    const institutionsResponse = await InstitutionService.getInstitutionsByUser(req);
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

  route.post("/user", isAuth, renewToken, basiqAuth, async (req, res) => {
    const returnData = req.returnData

    const createBasiqUserResponse = await UserService.checkOrCreateBasiqUser(req)

    // const institutionsResponse = await InstitutionService.getInstitutionsByUser(req);
    // if (institutionsResponse.status.code !== 200) {
    //   returnData.status = institutionsResponse.status;
    //   res.status(institutionsResponse.status.code).json(returnData);
    // }

    returnData.data = {

    };
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  })
}

export default InstitutionRouter