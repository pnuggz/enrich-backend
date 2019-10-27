const updateTransactions = async reqData => {
  const path = require("path")
  const updateTransactions = require(path.join(__dirname, "../../../src/jobs/transactions/updateTransactions.js"))

  await updateTransactions(reqData)
}

const transactions = {
  updateTransactions: updateTransactions
};

export default transactions;
