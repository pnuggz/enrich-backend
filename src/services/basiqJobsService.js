const path = require("path")

const config = require(path.join(__dirname, "../config/index.js"))
const basiqConfig = config.basiq

const JobModel = require(path.join(__dirname, "../models/jobModel.js"))
const BasiqService = require(path.join(__dirname, "../services/basiqService.js"))
const NotificationService = require(path.join(__dirname, "../services/notificationService.js"))

const req = {}

const checkJobsAndCreateNotification = async () => {
  const basiqAccessToken = basiqConfig.accessToken
  const getBasiqTokenResponse = await BasiqService.getToken(basiqAccessToken)
  if (getBasiqTokenResponse.status.code !== 200) {
    console.log(getBasiqTokenResponse.status)
    return
  }
  req.basiq = {
    accessToken: getBasiqTokenResponse.data.access_token
  }

  const basiqJobsResponse = await JobModel.getBasiqJobsAll()
  if (basiqJobsResponse.status.code !== 200) {
    console.log(basiqJobsResponse.status)
    return
  }

  const basiqJobs = basiqJobsResponse.data

  for (let i = 0; i < basiqJobs.length; i++) {
    const basiqJob = basiqJobs[i]
    const type = basiqJob.type

    let notificationResponse;
    if (type === "USER_CONNECTION_NEW") {
      const userConnectionJobResponse = await checkNewUserConnection(basiqJob)
      if (userConnectionJobResponse.status.code === 500) {
        notificationResponse = await createErrorNotification(basiqJob)
      } else if (userConnectionJobResponse.status.code === 200) {
        notificationResponse = await createSuccessNotification(basiqJob)
      }
    }

    if(notificationResponse.status.code === 200) {
      const jobUpdateResponse = await JobModel.updateBasiqJobByJobId(basiqJob.job_id)
      if (jobUpdateResponse.status.code !== 200) {
        console.log(jobUpdateResponse.status)
        return
      }
    }
  }

  return basiqJobs
};

const checkNewUserConnection = async (basiqJob) => {
  const returnData = {}
  const basiqJobId = basiqJob.job_id

  const jobResponse = await BasiqService.getJobByJobId(req, basiqJobId)
  if (jobResponse.status.code !== 200) {
    console.log(jobResponse.status)
    return
  }

  const jobData = jobResponse.data
  const jobSteps = jobData.steps

  const flags = {
    failed: 0,
    success: 0,
    pending: 0,
    errors: []
  }

  jobSteps.forEach(step => {
    if (step.status === "failed") {
      flags.failed = flags.failed + 1
      flags.errors.push(step.title)
    } else if (step.status === "pending" || step.status === "in-progress") {
      flags.pending = flags.pending + 1
    } else if (step.status === "success") {
      flags.success = flags.success + 1
    }
  });

  if (flags.failed > 0) {
    console.log(flags.errors)
    returnData.status = {
      code: 500,
      error: flags.errors,
      message: `Try again to user.`
    }
    return returnData
  }

  if (flags.success !== jobSteps.length) {
    returnData.status = {
      code: 202,
      error: ``,
      message: ``
    }
    return returnData
  }

  returnData.status = {
    code: 200,
    error: ``,
    message: ``
  }
  return returnData
}

const createErrorNotification = async (basiqJob) => {
  const createNotificationRespose = await NotificationService.createErrorNotification(basiqJob)
  if (createNotificationRespose.status.code !== 200) {
    console.log(createNotificationRespose.status)
    return createNotificationRespose
  }
  createNotificationRespose.status.code = 200
  return createNotificationRespose
}

const createSuccessNotification = async (basiqJob) => {
  const createNotificationRespose = await NotificationService.createSuccessNotification(basiqJob)
  if (createNotificationRespose.status.code !== 200) {
    console.log(createNotificationRespose.status)
    return createNotificationRespose
  }
  createNotificationRespose.status.code = 200
  return createNotificationRespose
}


const BasiqJobsService = {
  checkJobsAndCreateNotification: checkJobsAndCreateNotification
};

module.exports = BasiqJobsService;
