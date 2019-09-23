import mysql2 from "mysql2/promise";

import config from "../config/index";

const mysql2Config = config.mysql;

const pool = mysql2.createPool({
  host: mysql2Config.host,
  user: mysql2Config.user,
  password: mysql2Config.password,
  database: mysql2Config.database,
  waitForConnections: true,
  connectionLimit: mysql2Config.limit,
  queueLimit: 0
});

export const Connection = () => {
  return pool;
};
