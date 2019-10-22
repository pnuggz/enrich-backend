import Connection from "../loaders/mysql"

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

const JobModel = {
  saveBasiqConnectionJob: saveBasiqConnectionJob
};

export default JobModel