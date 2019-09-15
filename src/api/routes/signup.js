import { Router } from "express";

import config from "../../config/index";

import SignupService from "../../services/signupService";
import EmailService from "../../services/emailService";

const SignupRouter = app => {
  const route = Router();

  app.use("/signup", route);

  route.post(
    "/submit",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      const userData = await SignupService.submit(req);
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

      res.json(userData);
    }
  );

  route.get(
    "/authenticate/:verificationToken",
    // ADD MIDDLEWARE VALIDATOR HERE
    async (req, res) => {
      const isVerified = await SignupService.authenticate(req);
      const user = isVerified.user;

      if (isVerified) {
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

        res.json(true);
      } else {
        res.json(false);
      }
    }
  );
};

export default SignupRouter;
