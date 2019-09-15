import { Router } from "express";

import { Plaid } from "../../loaders/plaid";

const ManualRouter = app => {
  const route = Router();

  app.use("/manual", route);

  route.get(
    "/accounts/get",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      // let accounts;
      // let access_token = "access-development-8f19ab3c-ca1a-4921-9630-7a02265670df"
      // Plaid().exchangePublicToken(
      //   "public-development-efcd443b-883f-43d2-b9f2-9ffb40edaa7a",
      //   function(err, res) {
      //     console.log(res);
      //     access_token = res.access_token;

      //     Plaid().getAccounts(access_token, function(err, res) {
      //       accounts = res.accounts;
      //       console.log(res);
      //     });
      //   }
      // );

      const [err, response] = await Plaid().getAccounts(
        "access-development-8f19ab3c-ca1a-4921-9630-7a02265670df"
      );
      // const [err, response] = await Plaid().removeItem(
      //   "access-development-8f19ab3c-ca1a-4921-9630-7a02265670df"
      // );

      console.log(response);
      res.json(response);
    }
  );
};

export default ManualRouter;
