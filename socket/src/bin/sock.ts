"use strict";

import { Crypter } from "../lib/crypter";
import { readFileSync } from "fs";
import * as path from "path";
import { createServer } from "https";
import { Server } from "socket.io";
import log from "@utils/log";
import colors from "colors";
import express from "express";
import cors from "cors";
import initDBConnections from "@utils/controllers/utils/databaseConnectionInitalizer";

try {
  const app = express();
  const httpsServer = createServer(app);
  /*
  {
    key:readFileSync(path.join(__dirname, "../../secret/key.pem")),
    cert:readFileSync(path.join(__dirname, "../../secret/cert.pem"))
  }
  */

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
  app.use(cors());

  let port: any = process.env.PORT || 3000;

  httpsServer.listen(port);
  const io = new Server(httpsServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  //let users: any = [];
  log(
    `{online} Socket initialized and listening at ${colors.bold(
      colors.yellow(port)
    )}, waiting for connections...`
  );
  //initDBConnections();

  io.on("connection", (socket) => {
    log(`A new connection with "${socket.id}" ID.`, colors.dim);
    /*  socket.onAny((event, data) => {
    
            })
            */
    socket.on("message", (message: any) => {
      io.emit("message", message);
    });
    socket.on(
      "encrypt",
      async (
        payload: { payload: string; secret?: { iv?: Buffer; key?: Buffer } },
        ack
      ) => {
        let crypter = new Crypter();
        let data = await crypter
          .encrypt(payload.payload, payload.secret)
          .catch((err) => {
            ack
              ? ack({ err })
              : log(
                  `{disturb} Encountered an error at "encrypt" listener on socket recognized as "${socket.id} -> ` +
                    err,
                  colors.red
                );
          });
        if (typeof data !== "object") return;
        ack ? ack({ data }) : false;
      }
    );
    socket.on("disconnect", (reason) => {
      log(
        `Socket "${socket.id}" disconnected with "${reason}" reason.`,
        colors.dim
      );
    });
  });
} catch (err: any) {
  log(
    "{error} Encountered an error during initializing socket server -> " +
      err.message,
    colors.red
  );
}
