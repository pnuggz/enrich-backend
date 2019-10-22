import express from "express";
import socketIo from "socket.io";

import Logger from "./loaders/logger";
import config from "./config";
import { serverLoader, webSocketLoader } from "./loaders";

// CHANGE TO HTTPS WHEN USING REAL SERVER
import https from "http"

const startServer = () => {
  const app = express();

  serverLoader({ expressApp: app });

  // const server = https.createServer({ key: config.server.key, cert: config.server.cert }, app);
  const server = https.Server(app);
  const io = socketIo(server)

  server.listen(config.port, err => {
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

  webSocketLoader({ websocket: io })
  io.on('connection', function (socket) {
    console.log('Client connected to / namespace.');

    socket.emit("news", { test: "TEST" })

    // Disconnect listener
    socket.on('disconnect', function () {
      console.log('Client disconnected.');
    });
  });
};

startServer();
