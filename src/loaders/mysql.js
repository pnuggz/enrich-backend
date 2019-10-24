const path = require("path")
const mysql2 = require("mysql2/promise")

const config = require(path.join(__dirname, "../config/index.js"))

const mysql2Config = config.mysql;

const Connection = mysql2.createPool({
  host: mysql2Config.host,
  user: mysql2Config.user,
  password: mysql2Config.password,
  database: mysql2Config.database,
  waitForConnections: true,
  connectionLimit: mysql2Config.limit,
  queueLimit: 0
});

module.exports = Connection;
