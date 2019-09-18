import { Router } from "express";

import config from "../../config/index";

import SignupService from "../../services/signupService";
import EmailService from "../../services/emailService";

const SignupRouter = app => {
  const route = Router();

  app.use("/signup", route);

  route.post(
    "/",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      const userData = await SignupService.submit(req);
      const userDataStatusCode = userData.status.code
      if(userDataStatusCode === 500) {
        res.status(userDataStatusCode).json(userData)
        return;
      }

      const user = userData.user;
      const userVerification = userData.verification;
      const baseUrl = req.protocol + "://" + req.hostname + ":" + config.port;

      const emailData = {
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
      const email = await EmailService.send(req, emailData, 1);
      const emailStatusCode = email.status.code

      if(emailStatusCode === 500) {
        res.status(userDataStatusCode).json(email)
        return
      }

      res.status(userDataStatusCode).json(userData);
    }
  );

  route.get(
    "/authenticate/:verificationToken",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      const userData = await SignupService.authenticate(req);
      const userDataStatusCode = userData.status.code
      const user = userData.user;

      if (userDataStatusCode === 500) {
        res.status(userDataStatusCode).json(userData)
        return;
      } else {
        const baseUrl = req.protocol + "://" + req.hostname + ":" + config.port;

        const emailData = {
          to: user.email,
          from: "noreply@hiryan.net",
          dynamic_template_data: {
            subject: "Start enriching lives.",
            preheader: "Get started right away.",
            login_link: baseUrl + "/login"
          }
        };
        
        const email = await EmailService.send(req, emailData, 2);
        const emailStatusCode = email.status.code
        if(emailStatusCode === 500) {
          res.status(userDataStatusCode).json(email)
          return
        }

        res.status(userDataStatusCode).json(userData);
      }
    }
  );
};

export default SignupRouter;
