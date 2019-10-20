import workerpool from "workerpool";

import config from "../config";

import transactions from "./transactions";

const workerpoolConfig = config.workerpool;

const pool = workerpool.pool();

const loadTransactions = (input = null, callback = null) => {
  pool
    .exec(transactions.loadTransactions, [input])
    .then(callback)
    .catch(function (err) {
      console.error(err);
    });
};

const workerJobs = {
  loadTransactions: loadTransactions
};

export default workerJobs;
