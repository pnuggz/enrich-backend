import { Router } from "express";

import AccountService from "../../services/accountService";

const AccountRouter = app => {
  const route = Router();

  app.use("/account", route);

  route.post(
    "/token",
    async (req, res) => {
      const userData = await AccountService.exchangeToken(req)
      const userDataStatusCode = userData.status.code;
      if (userDataStatusCode === 500) {
        res.status(userDataStatusCode).json(userData);
        return;
      }

      res.json(userData);
    }
  );
};

export default AccountRouter;
