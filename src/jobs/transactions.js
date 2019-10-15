const loadTransactions = (input = null) => {
  setTimeout(() => {
    console.log(input)
  }, 10000)
  return input
}

const transactions = {
  loadTransactions:loadTransactions
}

export default transactions