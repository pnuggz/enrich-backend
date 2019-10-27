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

  const userAccountsResponse = await AccountModel.getAccountsByUserWithTrackingSettings(user.id)
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

  const accountsTracking = accounts
    .filter(account => transactionsByAccounts[account.basiq_account_id] !== undefined && transactionsByAccounts[account.basiq_account_id].length > 0)
    .map(account => {
      const transactions = transactionsByAccounts[account.basiq_account_id]
      const startDate = (date1 > account.created_datetime) ? date1 : account.created_datetime
      const includeDollar = account.include_dollar
      const monthlyAmount = transactions.reduce((sum, transaction) => {
        const transactionAmount = parseFloat(transaction.amount) * -1
        if (startDate > transaction.postDate || transactionAmount < 0) {
          return sum
        }

        let roundUp = parseFloat((Math.ceil(transactionAmount) - transactionAmount).toFixed(2))
        if (roundUp === 0 && includeDollar) {
          roundUp = 0.50
        }

        return parseFloat((sum + roundUp).toFixed(2))
      }, 0)

      return {
        account: account,
        monthlyAmount: monthlyAmount
      }
    })

  const month = dateFns.format(new Date(), "M");
  const year = dateFns.format(new Date(), "yyyy");
  for (let i = 0; i < accountsTracking.length; i++) {
    const accountObj = accountsTracking[i]
    const account = accountObj.account
    const monthlyAmount = accountObj.monthlyAmount
    const updateResponse = await AccountModel.updateAccountMonthlyTracking(account.account_tracking_id, monthlyAmount, month, year)
  }
}

module.exports = updateTransactions