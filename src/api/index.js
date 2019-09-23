import express, { Router } from "express";

import signup from "./routes/signup";
import login from "./routes/login";
import user from "./routes/user";
import account from "./routes/account";

// guaranteed to get dependencies
const routes = () => {
  const app = Router()
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  signup(app);
  login(app);
  user(app);
  account(app);

  return app;
};

export default routes;
