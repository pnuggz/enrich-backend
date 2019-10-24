const fetch = require("node-fetch")

const dateFnsFormat = require("date-fns/format")
const dateFnsStartOfMonth = require("date-fns/startOfMonth")
const dateFns = {
  format: dateFnsFormat,
  startOfMonth: dateFnsStartOfMonth
};

const returnData = {};

const dataFetch = (url, fetchMethod, headers, body = null) => {
  const options = {
    method: fetchMethod,
    headers: headers
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const returnStatus = {
    code: null
  }

  return new Promise((res, rej) => {
    fetch(url, options)
      .then(basiqResponse => {
        returnStatus.code = basiqResponse.status
        return basiqResponse.json();
      })
      .then(basiqData => {
        returnData.status = returnStatus
        returnData.data = basiqData;
        res(returnData);
      })
      .catch(err => {
        console.log(err);
        returnData.status = {
          code: err.status
        };
        rej(returnData);
      });
  });
};

const getToken = async (basiqAccessToken) => {
  const fetchMethod = "POST";
  const url = `https://au-api.basiq.io/token`;
  const headers = {
    Authorization: `Basic ${basiqAccessToken}`,
    "Content-Type": `application/x-www-form-urlencoded`,
    "basiq-version": `2.0`
  };

  return dataFetch(url, fetchMethod, headers);
}

const createUser = async (req, email, mobile = "") => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "POST";
  const url = "https://au-api.basiq.io/users";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: `application/json`,
    "Content-Type": `application/json`
  };
  const body = {
    email: email,
    mobile: mobile
  };

  return dataFetch(url, fetchMethod, headers, body);
};

const getUser = async (req, basiqUserId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
};

const updateUser = async (req, basiqUserId, email, mobile = "") => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "POST";
  const url = `https://au-api.basiq.io/users/${basiqUserId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: `application/json`,
    "Content-Type": `application/json`
  };
  const body = {
    email: email,
    mobile: mobile
  };

  return dataFetch(url, fetchMethod, headers, body);
};

const deleteUser = async (req, basiqUserId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "DELETE";
  const url = `https://au-api.basiq.io/users/${basiqUserId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: `application/json`,
    "Content-Type": `application/json`
  };

  return dataFetch(url, fetchMethod, headers);
};

// @TODO
// Returns a job, so add the job to a cache of jobs
// Use a script to forever loop the jobs
// If there are jobs check the status
// Once job complete push notification to front end
// On the front end, make the process like a lockdown security type encryption. Makes them feel safe while hiding the delay
const createUserConnection = async (
  req,
  basiqUserId,
  institutionId,
  loginData
) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "POST";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/connections`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: `application/json`,
    "Content-Type": `application/json`
  };
  const body = {
    loginId: loginData.login,
    password: loginData.password,
    institution: {
      id: institutionId
    }
  };

  return dataFetch(url, fetchMethod, headers, body);
};

const getAccounts = async (req, basiqUserId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/accounts`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
};

const getAccountsByInstitution = async (
  req,
  basiqUserId,
  basiqInstitutionId
) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/accounts`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return new Promise((res, rej) => {
    dataFetch(url, fetchMethod, headers)
      .then(response => {
        const accounts = response.data.data.filter(
          account => account.institution === basiqInstitutionId
        );
        res(accounts);
      })
      .catch(err => {
        rej(err);
      });
  });
};

const getAccountsById = async (req, basiqUserId, basiqAccountId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/accounts/${basiqAccountId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
};

const getTransactions = async (req, basiqUserId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/transactions`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
};

const getTransactionsById = async (req, basiqUserId, basiqTransactionId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/transactions/${basiqTransactionId}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
};

const getTransactionsByAccount = async (
  req,
  basiqUserId,
  basiqAccountId,
  date1 = null,
  date2 = null
) => {
  const startDate =
    date1 !== null
      ? dateFns.format(date1, "yyyy-MM-dd")
      : dateFns.format(dateFns.startOfMonth(new Date()), "yyyy-MM-dd");
  const endDate =
    date2 !== null
      ? dateFns.format(date2, "yyyy-MM-dd")
      : dateFns.format(new Date(), "yyyy-MM-dd");

  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const filter = encodeURI(
    `transaction.postDate.bt('${startDate}','${endDate}')`
  );

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/users/${basiqUserId}/transactions?filter=${filter}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return new Promise((res, rej) => {
    dataFetch(url, fetchMethod, headers)
      .then(response => {
        const links = response.data.links;
        const transactions = response.data.data.filter(
          transaction => transaction.account === basiqAccountId
        );
        const returnData = {
          transactions: transactions,
          links: links
        };
        res(returnData);
      })
      .catch(err => {
        console.log(err);
        rej(err);
      });
  });
};

const getInstitutions = async req => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;

  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/institutions`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
};

const getJobByJobId = async (req, basiqJobId) => {
  const basiqData = req.basiq;
  const accessToken = basiqData.accessToken;
  console.log(basiqJobId)
  const fetchMethod = "GET";
  const url = `https://au-api.basiq.io/jobs/` + basiqJobId;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  return dataFetch(url, fetchMethod, headers);
}

const BasiqService = {
  getToken: getToken,
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  createUserConnection: createUserConnection,
  getAccounts: getAccounts,
  getAccountsById: getAccountsById,
  getAccountsByInstitution: getAccountsByInstitution,
  getTransactions: getTransactions,
  getTransactionsById: getTransactionsById,
  getInstitutions: getInstitutions,
  getTransactionsByAccount: getTransactionsByAccount,
  getJobByJobId: getJobByJobId
};

module.exports = BasiqService;
