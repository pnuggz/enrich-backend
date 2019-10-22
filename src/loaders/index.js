import expressLoader from "./express";
import socketIoLoader from "./socketIo";
import Logger from "./logger";

export const serverLoader = async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

export const webSocketLoader = async ({ websocket }) => {
  await socketIoLoader({ io: websocket })
  Logger.info("✌️ WebSocket loaded");
}