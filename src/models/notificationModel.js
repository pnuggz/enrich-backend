const path = require("path")

const Connection = require(path.join(__dirname, "../loaders/mysql.js"))

const Authorization = require(path.join(__dirname, "../library/authorization"))

const returnData = {};

const getNotificationsByUser = async (userId) => {
  const queryString1 = `
    SELECT 
    notifications.id,
    notifications.user_id as userId,
    notifications.user_id,
    notifications_text.text,
    notifications.is_read,
    notifications.url
    FROM notifications
    JOIN notifications_text ON notifications_text.id = notifications.notification_text_id
    WHERE notifications.user_id = ?
    ORDER BY notifications.created_datetime DESC
  `;

  try {
    const [results, fields] = await Connection.query(queryString1, [userId])

    if (!Authorization.authorize(results, userId)) {
      returnData.status = Authorization.defaultUnauthMsg();
      return (returnData);
    }

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
};

const createNotificationBySystem = async (userId, notificationTextId, url) => {
  const queryString1 = `
  INSERT INTO notifications (user_id, notification_text_id, url) 
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE user_id = ?
`;

try {
  const [results, fields] = await Connection.query(queryString1, [userId, notificationTextId, url, userId])
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

const NotificationModel = {
  getNotificationsByUser: getNotificationsByUser,
  createNotificationBySystem: createNotificationBySystem
}

module.exports = NotificationModel