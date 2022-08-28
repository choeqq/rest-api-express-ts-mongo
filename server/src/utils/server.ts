import express from "express";
import deserializedUser from "../middleware/deserializedUser";
import routes from "../routes";
import cors from "cors";
import config from "config";
import cookieParser from "cookie-parser";

function createServer() {
  const app = express();

  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use(deserializedUser);

  routes(app);

  return app;
}

export default createServer;
