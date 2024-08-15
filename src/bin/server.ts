import express from "express";
import moment from "moment";
import log from "@util/log";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import cors from "cors";
import colors from "colors";
import xml from "xml";
import Logger from "@middleware/server/Logger";
import NotFoundMiddleware from "@middleware/server/404";
import { Client as PostgresClient } from "@hooks/db/postgres";
import { SocketManager } from "@lib/ws/SocketManager";
import * as path from "path";
import APIV1Router from "@routes/api/v1/api";
import SocketEventLoader from "@events/ws/eventLoader";
import redisHealthCheck from "@util/db/redisHealthCheck";
import axios from "axios";
//import "../tests/token";

const Socket = new SocketManager();
let io = Socket.io;
let { SITE_DOMAIN } = process.env;
const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(Logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use("/api/v1", APIV1Router);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});
const allowCrossDomain = (req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};
app.use(allowCrossDomain);

console.clear();
if (process.env.MODE === "prod") {
  axios({
    method: "GET",
    url: SITE_DOMAIN,
  }).then(() => {
    console.log("Pinged!");
  });
  setInterval(() => {
    axios({
      method: "GET",
      url: SITE_DOMAIN,
    }).then(() => {
      console.log("Pinged!");
    });
  }, 60 * 1000 * 10);
}
PostgresClient().then(() => {
  redisHealthCheck();
  log("{ring} Initializing API and services..", colors.dim);
  Socket.Connect(
    httpServer,
    {
      path: process.env.SOCKET_PATH,
      cookie: {
        name: "handshake-fingerprint",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 100,
      },
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    },
    Number(process.env.PORT),
    (server: any) => {
      io = Socket.io;
      SocketEventLoader(io);
      log(
        `{online} API and Socket listening on ${colors.blue(
          `http://${server.address().address}:${server.address().port}/`
        )}`,
        colors.bold
      );
      log(
        `${
          colors.yellow("* To check the API status: ") + colors.blue("GET /")
        }`,
        colors.bold
      );
      log(
        `${
          colors.yellow("* Socket Pathway: ") +
          colors.blue(`${process.env.SOCKET_PATH}`)
        }`,
        colors.bold
      );
    }
  );
});
