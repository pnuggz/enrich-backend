const path = require("path")

const dateFnsFormat = require("date-fns/format")
const dateFnsStartOfMonth = require("date-fns/startOfMonth")
const dateFnsEndOfMonth = require("date-fns/endOfMonth")
const dateFns = {
  format: dateFnsFormat,
  startOfMonth: dateFnsStartOfMonth,
  endOfMonth: dateFnsEndOfMonth
};

const UserService = require(path.join(__dirname, "../../services/userService.js"))
const BasiqService = require(path.join(__dirname, "../../services/basiqService.js"))

const AccountModel = require(path.join(__dirname, "../../models/accountModel.js"))

const updateTransactions = async reqData => {
  const user = reqData.user
  const basiq = reqData.basiq

  const userAccountsResponse = await AccountModel.getAccountsByUser(user.id)
  if (userAccountsResponse.status.code !== 200 || userAccountsResponse.data.length === 0) {
    return
  }
  const accounts = userAccountsResponse.data

  const userBasiqDataResponse = await UserService.getUserBasiqData(reqData)
  if (userBasiqDataResponse.status.code !== 200) {
    return
  }
  const userBasiqId = userBasiqDataResponse.data[0].basiq_id

  const date1 = dateFns.startOfMonth(new Date())
  const date2 = dateFns.endOfMonth(new Date())

  const basiqTransactionsResponse = await BasiqService.getTransactions(reqData, userBasiqId, date1, date2)
  if (basiqTransactionsResponse.status.code !== 200 || basiqTransactionsResponse.data.data.length === 0) {
    return
  }
  const transactions = basiqTransactionsResponse.data.data
  const transactionsByAccounts = transactions.reduce((obj, transaction) => {
    const accountId = transaction.account
    if (obj[accountId] === undefined) {
      obj[accountId] = []
    }
    obj[accountId].push(transaction)
    return obj
  }, {})

  console.log(transactionsByAccounts)
}

module.exports = updateTransactions