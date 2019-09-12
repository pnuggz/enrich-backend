import { Router } from "express";
import user from "./routes/user";

// guaranteed to get dependencies
const routes = () => {
  const app = Router();

  user(app);

  return app;
};

export default routes;
