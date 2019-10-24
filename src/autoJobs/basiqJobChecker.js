const path = require("path")
const BasiqJobsService = require(path.join(__dirname, "../services/basiqJobsService.js"))

const basiqJobChecker = () => {
  return new Promise(async (res) => {
    const response = await BasiqJobsService.checkJobsAndCreateNotification()
    if (response != undefined) {
      setTimeout(() => {
        res(false)
      }, 3000)
    }
  })
}

module.exports = basiqJobChecker