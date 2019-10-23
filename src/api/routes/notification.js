import { Router } from "express"

import middlewares from "./middlewares/index.js"
const isAuth = middlewares.isAuth;
const renewToken = middlewares.renewToken;

import NotificationService from "../../services/notificationService"

const returnData = {};

const NotificationRouter = app => {
  const route = Router();

  app.use("/notification", route);

  route.get("/all", isAuth, renewToken, async (req, res) => {
    const returnData = req.returnData

    const notificationsResponse = await NotificationService.getNotifications(req)
    if (notificationsResponse.status.code !== 200) {
      returnData.status = notificationsResponse.status
      return returnData
    }

    returnData.data = notificationsResponse.data
    returnData.status = {
      code: 200,
      err: ``,
      msg: ``
    };
    res.json(returnData);
  })
}

export default NotificationRouter