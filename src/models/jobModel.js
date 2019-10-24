const path = require("path")

const Connection = require(path.join(__dirname, "../loaders/mysql"))

const returnData = {}

const saveBasiqConnectionJob = async (userId, basiqJobId, institutionId) => {
  const queryString1 = `
    INSERT INTO jobs_basiq (user_id, job_id, type, unique_identifier) 
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE user_id = ?
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId, basiqJobId, 1, institutionId, userId])
    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    };
    returnData.data = results;
    return (returnData);
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
}

const getBasiqJobsAll = async () => {
  const queryString1 = `
    SELECT 
    jobs_basiq.*,
    jobs_basiq_type.type
    FROM jobs_basiq
    JOIN jobs_basiq_type ON jobs_basiq_type.jobs_basiq_id = jobs_basiq.type
  `;

  try {
    const [results, fields] = await Connection.query(queryString1)
    returnData.status = {
      code: 200,
      error: ``,
      message: ``
    };
    returnData.data = results;
    return (returnData);
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
}

const JobModel = {
  saveBasiqConnectionJob: saveBasiqConnectionJob,
  getBasiqJobsAll: getBasiqJobsAll
};

module.exports = JobModel