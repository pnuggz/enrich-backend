import dotenv from "dotenv";
import fs from "fs";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  port: process.env.PORT,

  logs: {
    level: process.env.LOG_LEVEL || "silly"
  },

  api: {
    prefix: "/api"
  },

  mysql: {
    limit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  },

  plaid: {
    clientId: process.env.PLAID_CLIENT_ID,
    publicKey: process.env.PLAID_PUBLIC_KEY,
    secretKey: process.env.PLAID_SECRET,
    env: process.env.PLAID_ENV,
    version: process.env.PLAID_VERSION
  },

  jwt: {
    publicKey: fs.readFileSync("./public.key", "utf8"),
    privateKey: fs.readFileSync("./private.key", "utf8"),
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE
  },

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY
  }
};

export default config;
