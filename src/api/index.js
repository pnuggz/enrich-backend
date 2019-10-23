const path = require("path");

import express, { Router } from "express"

import signup from "./routes/signup"
import login from "./routes/login"
import account from "./routes/account"
import user from "./routes/user"
import institution from "./routes/institution"
import notification from "./routes/notification"

import test from "./routes/test.js"

// guaranteed to get dependencies
const routes = () => {
  const app = Router()
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  signup(app);
  login(app);
  // user(app);
  account(app);
  institution(app);
  notification(app)

  test(app);

  return app;
};

export default routes;
