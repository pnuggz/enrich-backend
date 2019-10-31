import { Router } from "express"

import InstitutionService from "../../services/institutionService.js"

const PublicRouter = app => {
  const route = Router();

  app.use("/public", route);

  route.get("/institution/all", async (req, res) => {
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
}

export default PublicRouter