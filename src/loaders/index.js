import expressLoader from "./express";
import socketIoLoader from "./socketIo";
import cronJobs from "./cronJobs"
import Logger from "./logger";

export const serverLoader = async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");

  setTimeout(() => {
    cronJobs()
    Logger.info("✌️ Cron Jobs started");
  }, 5000)
};

export const webSocketLoader = async ({ websocket }) => {
  await socketIoLoader({ io: websocket })
  Logger.info("✌️ WebSocket loaded");
}