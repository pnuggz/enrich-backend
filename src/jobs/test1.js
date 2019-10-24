const autoJobs = async () => {
  const path = require("path")
  const test2 = require(path.join(__dirname, "../../../src/jobs/test2.js"))
  // const test2 = () => {
  //   return new Promise(res => {
  //     setTimeout(() => {
  //       res(false)
  //     }, 5000)
  //   })
  // }

  const test = async () => {
    const testx = await test2()
    return testx
  }

  const res1 = await test()
  return false
}

export default autoJobs