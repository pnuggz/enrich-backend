const loadTransactions = userData => {
  const mysql2 = require("mysql2");
  const plaid = require("plaid");
  const dateFns = require("date-fns");

  const mysql2Config = {
    limit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  };

  const connection = mysql2.createPool({
    host: mysql2Config.host,
    user: mysql2Config.user,
    password: mysql2Config.password,
    database: mysql2Config.database,
    waitForConnections: true,
    connectionLimit: mysql2Config.limit,
    queueLimit: 0
  });

  const plaidConfig = {
    clientId: process.env.PLAID_CLIENT_ID,
    publicKey: process.env.PLAID_PUBLIC_KEY,
    secretKey: process.env.PLAID_SECRET,
    env: process.env.PLAID_ENV,
    version: process.env.PLAID_VERSION
  };

  const plaidClient = new plaid.Client(
    plaidConfig.clientId,
    plaidConfig.secretKey,
    plaidConfig.publicKey,
    plaidConfig.env,
    {
      version: plaidConfig.version
    }
  );

  const userId = userData.user.id;

  const plaidData = () => {
    return new Promise((res, rej) => {
      const queryString1 = `
          SELECT 
          plaid.id,
          plaid.access_token,
          plaid.created_datetime
          FROM plaid
          WHERE plaid.user_id = ${userId}`;
      connection.query(queryString1, (err, results, fields) => {
        if (err !== null) {
          rej(err);
        }
        res(results[0]);
      });
    });
  };

  const getTransactions = (
    plaidData,
    date1 = null,
    date2 = null,
    offset = 0
  ) => {
    const accessToken = plaidData.access_token;
    const startDate =
      date1 !== null
        ? dateFns.format(date1, "yyyy-MM-dd")
        : dateFns.format(dateFns.startOfMonth(new Date()), "yyyy-MM-dd");
    const endDate =
      date2 !== null
        ? dateFns.format(date2, "yyyy-MM-dd")
        : dateFns.format(new Date(), "yyyy-MM-dd");

    return new Promise((res, rej) => {
      try {
        plaidClient.getTransactions(
          accessToken,
          startDate,
          endDate,
          {
            count: 250,
            offset: offset
          },
          (error, result) => {
            if (error != null) {
              rej(error);
            }
            res(result);
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  };

  plaidData()
    .then(response => {
      return getTransactions(response);
    })
    .then(response => {
      console.log(response);
    });
};

const transactions = {
  loadTransactions: loadTransactions
};

export default transactions;
