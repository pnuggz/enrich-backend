import Connection from "../loaders/mysql.js"

import Authorization from "../library/authorization"

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

const NotificationModel = {
  getNotificationsByUser: getNotificationsByUser
}

export default NotificationModel