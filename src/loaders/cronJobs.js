import cron from "node-cron"

import autoWorkers from "./autoWorkers"

let running = false
const cronJobs = () => {
  // This is the automated worker jobs that continuously runs
  cron.schedule("1-59 * * * * *", async () => {
    if (running) {
      return
    }
    running = true

    const callback = (finish) => {
      console.log(finish)
      running = finish
    }

    console.log("NEW LOOP")
    await autoWorkers(callback)
  });


  // cron.schedule("1-59 * * * * *", () => {
  //   console.log("TESTING crons")
  // })
}

export default cronJobs