"use strict";

import { Crypter } from '../lib/crypter';
import { readFileSync } from 'fs';
import * as path from 'path'
import { createServer } from "https";
import { Server } from "socket.io";
import log from "@utils/log";
import colors from 'colors';
import initRedisConnection from '@utils/controllers/utils/databaseConnectionInitalizer';
import moment from 'moment';

try {
    const httpsServer = createServer({
        key: readFileSync(path.join(__dirname, "../../secret/socket.key")),
        cert: readFileSync(path.join(__dirname, "../../secret/socket.cert"))
    });

    httpsServer.listen(process.env.PORT);
    let port: any = process.env.PORT;
    const io = new Server(httpsServer, {
        cors: {
            origin: "*" // keep this active on only development.
        }
    });
    //let users: any = [];
    log(`{online} Socket initialized and listening at ${(colors.bold(colors.yellow(port)))}, waiting for connections...`)
    initRedisConnection();

    io.on("connection", (socket) => {
        log(`A new connection with "${socket.id}" ID.`, colors.dim)
      /*  socket.onAny((event, data) => {

        })
        */
        socket.on("encrypt", async (payload: { payload: string, secret?: { iv?: Buffer, key?: Buffer } }, ack) => {
            let crypter = new Crypter();
            let data = await crypter.encrypt(payload.payload, payload.secret).catch((err) => { ack ? ack({ err }) : log(`{disturb} Encountered an error at "encrypt" listener on socket recognized as "${socket.id} -> ` + err, colors.red) })
            if (typeof data !== "object") return;
            ack ? ack({ data }) : false;
        })
        socket.on("disconnect", (reason) => {
            log(`Socket "${socket.id}" disconnected with "${reason}" reason.`, colors.dim)
        })
    });
} catch (err: any) { log("{error} Encountered an error during initializing socket server -> " + err.message, colors.red) }     