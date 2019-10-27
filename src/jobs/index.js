import workerpool from "workerpool";

import config from "../config";

import transactions from "./transactionsIndex";

const workerpoolConfig = config.workerpool;

const pool = workerpool.pool();

const updateTransactions = (input = null, callback = null) => {
  pool
    .exec(transactions.updateTransactions, [input])
    .then(callback)
    .catch(function (err) {
      console.error(err);
    });
};

const workerJobs = {
  updateTransactions: updateTransactions
};

export default workerJobs;
