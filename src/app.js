import express from "express";

import Logger from "./loaders/logger";
import config from "./config";
import Loaders from "./loaders";

import { Connection } from "./loaders/mysql";

const startServer = () => {
  const app = express();

  Loaders({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  });
};

startServer();
