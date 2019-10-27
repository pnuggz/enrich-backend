import { Router } from "express"

import middlewares from "./middlewares/index.js"
const basiqAuth = middlewares.basiqAuth;
const isAuth = middlewares.isAuth;
const renewToken = middlewares.renewToken;

import workerJobs from "../../jobs"

const returnData = {};

const TestRouter = app => {
  const route = Router();

  app.use("/auto", route);

  route.get("/login/user", isAuth, renewToken, basiqAuth, async (req, res) => {
    const returnData = req.returnData

    const input = {
      user: req.user,
      basiq: req.basiq
    }

    workerJobs.updateTransactions(input)

    returnData.status = 200;
    res.json(returnData);
  });
};

export default TestRouter;
