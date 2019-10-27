import cron from "node-cron"

import config from "../config/index"

import BasiqService from "../services/basiqService"

import UserModel from "../models/userModel"

import autoWorkers from "./autoWorkers"
import jobs from "../jobs/index"

let running = false
const cronJobs = () => {
  // ----------------------------- Automatic Jobs Cron --------------------------------- //

  cron.schedule("1-59 * * * * *", async () => {
    if (running) {
      return
    }
    running = true

    const callback = (finish) => {
      running = finish
    }

    await autoWorkers(callback)
  });


  // ----------------------------- Standard Cron --------------------------------- //


  // Fetch the latest transactions every midnight
  cron.schedule("0 0 0 * * *", async () => {
    const basiqAccessToken = config.basiq.accessToken

    const userResponse = await UserModel.getUsersAll()
    const basiqResponse = await BasiqService.getToken(basiqAccessToken)

    const users = userResponse.data

    for (let i = 0; i < users.length; i++) {
      const user = users[i]

      const input = {
        user: user,
        basiq: basiqResponse.data
      }

      jobs.updateTransactions(input)
    }
  });

}

export default cronJobs