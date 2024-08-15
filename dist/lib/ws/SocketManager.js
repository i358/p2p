"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const socket_io_1 = require("socket.io");
const node_events_1 = require("node:events");
let socket = new node_events_1.EventEmitter();
let io = null;
class SocketManager {
    constructor() {
        this.io = io;
    }
    Instance() {
        socket.on("send", (config, payload) => {
            config.channel
                ? io.to(config.channel).emit(config.to, payload)
                : io.emit(config.to, payload);
        });
        return socket;
    }
    Connect(httpServer, config, port, cb) {
        if (!httpServer || !config)
            throw "WTF??";
        const io_ = new socket_io_1.Server(httpServer, config);
        io = io_;
        this.io = io_;
        let server = httpServer;
        let server_ = server.listen(port, () => {
            cb(server_);
        });
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=SocketManager.js.map