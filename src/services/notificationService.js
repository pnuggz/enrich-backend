import NotificationModel from "../models/notificationModel"

const returnData = {}

const getNotifications = async (req) => {
  const userId = req.user.id

  try {
    const notificationsResponse = await NotificationModel.getNotificationsByUser(userId)
    if (notificationsResponse.status.code !== 200) {
      returnData.status = notificationsResponse.status
      return returnData
    }
    const notificationsData = notificationsResponse.data

    const notifications = []
    let isNew = 0
    for (let counter = 0; counter < notificationsData.length; counter++) {
      const notification = notificationsData[counter]
      if (notification.is_read === 0) {
        isNew++
      }
      notifications.push(notification)
      if (isNew !== counter && counter >= 5) {
        break
      }
    }

    returnData.status = notificationsResponse.status
    returnData.data = notifications
    return returnData
  } catch (err) {
    console.log(err)
    returnData.status = {
      code: 500,
      error: err,
      message: `Internal server error.`
    };
    return (returnData);
  }
};

const NotificationService = {
  getNotifications: getNotifications
}

export default NotificationService