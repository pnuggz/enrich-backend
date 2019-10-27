const autoJobs = async () => {
  const path = require("path")
  const basiqJobChecker = require(path.join(__dirname, "../../../src/autoJobs/basiqJobChecker.js"))

  const basiqJobCheckerResponse = await basiqJobChecker()

  // Just keep adding them here and chain it. It will loop and keep going through the jobs

  return false
}

export default autoJobs