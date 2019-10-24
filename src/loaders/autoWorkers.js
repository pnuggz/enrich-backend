import workerpool from "workerpool";

import config from "../config";
const workerpoolConfig = config.workerpool;

import autoJobs from "../autoJobs/index"

const autoPool = workerpool.pool();

const autoWorker = (callback) => {
  autoPool
    .exec(autoJobs)
    .then(callback)
    .catch(function (err) {
      console.error(err);
    });
};

export default autoWorker;
