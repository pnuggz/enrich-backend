import expressLoader from "./express";
import Logger from "./logger";

const serverLoader = async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};

export default serverLoader;
