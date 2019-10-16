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
          plaid.created_datetime,
          plaid_accounts.id as account_id,
          plaid_accounts.account_id as plaid_account_id
          FROM plaid_accounts
          JOIN plaid ON plaid.id = plaid_accounts.plaid_id 
          WHERE plaid.user_id = ${userId}`;
      connection.query(queryString1, (err, results, fields) => {
        if (err !== null) {
          rej(err);
        }
        res(results);
      });
    });
  };

  const getTransactions = (
    plaidData,
    date1 = null,
    date2 = null,
    offset = 0
  ) => {
    const accessToken = plaidData[0].access_token;
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
            res({
              plaidData: plaidData,
              result: result
            });
          }
        );
      } catch (error) {
        rej(error);
      }
    });
  };

  const saveTransactions = (plaidData, transactionsResponse) => {
    const accountIdsArray = plaidData.reduce((array, row, key) => {
      array.push(row.plaid_account_id);
      return array;
    }, []);

    const accountsDataArray = plaidData.reduce((array, row, key) => {
      array[row.plaid_account_id] = {
        accountId: row.account_id,
        plaidAccountId: row.plaid_account_id
      };
      return array;
    }, []);

    const transactions = transactionsResponse.transactions.reduce(
      (array, row, key) => {
        if (accountIdsArray.includes(row.account_id)) {
          const accountId = accountsDataArray[row.account_id].accountId;
          row.database_account_id = accountId;
          array.push(row);
        }
        return array;
      },
      []
    );

    if (transactions.length === 0) {
      return;
    }

    const insertTransaction = transaction => {
      return new Promise((res, rej) => {
        const queryString1 = `
          INSERT INTO plaid_accounts_transactions
          (
            account_id, 
            plaid_transaction_id, 
            plaid_transaction_type, 
            description, 
            transaction_date, 
            amount, 
            iso_currency_code, 
            pending, 
            pending_id
          )
          VALUES
          (
            '${transaction.database_account_id}', 
            '${transaction.transaction_id}', 
            '${transaction.transaction_type}', 
            '${transaction.name}',
            '${transaction.date}',
            ${transaction.amount},
            '${transaction.iso_currency_code}',
            ${transaction.pending ? 1 : 0},
            '${transaction.pending_transaction_id}'
          )
          ON DUPLICATE KEY UPDATE plaid_transaction_id='${
            transaction.transaction_id
          }'
          `;
        connection.query(queryString1, (err, results, fields) => {
          if (err !== null) {
            rej(err);
          }
          res(results);
        });
      });
    };

    const insertCategory = (plaidAccountsTransactionId, transaction) => {
      const categories = transaction.category;
      const newCategoryIds = [];

      const createCategory = category => {
        return new Promise((res, rej) => {
          const queryString1 = `
            INSERT INTO plaid_accounts_transactions_categories (category)
            VALUES ('${category}')
            ON DUPLICATE KEY UPDATE category='${category}'
            `;
          connection.query(queryString1, (err, results, fields) => {
            if (err !== null) {
              rej(err);
            }
            res(results);
          });
        });
      };

      const assignCategory = (plaidAccountsTransactionId, categoryId) => {
        return new Promise((res, rej) => {
          const queryString1 = `
            INSERT INTO plaid_accounts_transactions_has_categories
            (
              plaid_accounts_transaction_id,
              plaid_accounts_transactions_category_id
            )
            VALUES
            (
              '${plaidAccountsTransactionId}', 
              '${categoryId}'
            )
            ON DUPLICATE KEY UPDATE plaid_accounts_transactions_category_id='${categoryId}'
            `;
          connection.query(queryString1, (err, results, fields) => {
            if (err !== null) {
              rej(err);
            }
            res(results);
          });
        });
      };

      categories.forEach(category => {
        createCategory(category)
          .then(response => {
            const insertId = response.insertId;
            if (insertId != 0) {
              assignCategory(plaidAccountsTransactionId, insertId);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    };

    transactions.forEach(transaction => {
      insertTransaction(transaction)
        .then(response => {
          const insertId = response.insertId;
          if (insertId !== 0) {
            insertCategory(insertId, transaction);
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  plaidData()
    .then(response => {
      return getTransactions(response);
    })
    .then(response => {
      return saveTransactions(response.plaidData, response.result);
    })
    .then(response => {
      // console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

const transactions = {
  loadTransactions: loadTransactions
};

export default transactions;
