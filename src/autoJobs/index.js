const autoJobs = async () => {
  const path = require("path")
  const basiqJobChecker = require(path.join(__dirname, "../../../src/autoJobs/basiqJobChecker.js"))

  const basiqJobCheckerResponse = await basiqJobChecker()
  console.log("END OF LOOP")
  return false
}

export default autoJobs