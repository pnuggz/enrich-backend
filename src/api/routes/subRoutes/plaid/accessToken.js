import { Router } from "express";

const AccessTokenRouter = app => {
  const route = Router();
  app.use("/plaid/access-token", route);

  route.get("/get", async (req, res) => {
    res.json("HERE");
  });
};

export default AccessTokenRouter;
