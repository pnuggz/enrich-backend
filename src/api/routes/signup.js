import { Router } from "express";

import config from "../../config/index";

import SignupService from "../../services/signupService";
import EmailService from "../../services/emailService";

const SignupRouter = app => {
  const route = Router();

  app.use("/signup", route);

  route.post("/", async (req, res) => {
    const returnData = {};

    const userData = await SignupService.submit(req);
    const userDataStatusCode = userData.status.code;
    if (userDataStatusCode === 500) {
      returnData.status = userData.status;
      res.status(userDataStatusCode).json(returnData);
      return;
    }

    const user = userData.data.user;
    const userVerification = userData.data.verification;
    const baseUrl = req.protocol + "://" + req.hostname + ":" + config.port;

    const emailOptions = {
      to: user.email,
      from: "noreply@hiryan.net",
      dynamic_template_data: {
        subject: "Verify your email.",
        preheader: "Start enriching lives.",
        verify_link:
          baseUrl +
          "/api/signup/authenticate/" +
          userVerification.verification_token
      }
    };
    const emailData = await EmailService.send(req, emailOptions, 1);
    const emailStatusCode = emailData.status.code;
    if (emailStatusCode === 500) {
      returnData.status = emailData.status;
      res.status(emailStatusCode).json(returnData);
      return;
    }

    returnData.data = {
      user: user
    };
    returnData.status = userData.status;
    res.json(returnData);
  });

  route.get("/authenticate/:verificationToken", async (req, res) => {
    const returnData = {};

    const userData = await SignupService.authenticate(req);
    const userDataStatusCode = userData.status.code;
    const user = userData.data.user;

    if (userDataStatusCode === 500) {
      returnData.status = userData.status;
      res.status(userDataStatusCode).json(returnData);
      return;
    } else {
      const baseUrl = req.protocol + "://" + req.hostname + ":" + config.port;

      const emailOptions = {
        to: user.email,
        from: "noreply@hiryan.net",
        dynamic_template_data: {
          subject: "Start enriching lives.",
          preheader: "Get started right away.",
          login_link: baseUrl + "/login"
        }
      };

      const emailData = await EmailService.send(req, emailOptions, 2);
      const emailStatusCode = emailData.status.code;
      if (emailStatusCode === 500) {
        returnData.status = emailData.status;
        res.status(emailStatusCode).json(returnData);
        return;
      }

      returnData.data = {
        user: user
      };
      returnData.status = userData.status;
      res.json(returnData);
    }
  });
};

export default SignupRouter;
