const path = require("path")
const InstitutionService = require(path.join(__dirname, "../services/institutionService"))

const test2 = () => {
  return new Promise(async (res) => {
    const response = await InstitutionService.getInstitutions()
    if (response != undefined) {
      console.log(response)
      setTimeout(() => {
        res(false)
      }, 3000)
    }
  })
}

module.exports = test2