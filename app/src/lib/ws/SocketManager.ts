import { Server } from "socket.io";
import { EventEmitter } from "node:events";
let socket = new EventEmitter();
let io: any = null;

export class SocketManager {
  public io: any = io;
  Instance() {
    socket.on("send", (config, payload) => {
      config.channel
        ? io.to(config.channel).emit(config.to, payload)
        : io.emit(config.to, payload);
    });
    return socket;
  }
  Connect(httpServer: any, config: object, port: number, cb: Function) {
    if (!httpServer || !config) throw "WTF??";
    const io_ = new Server(httpServer, config);
    io = io_;
    this.io = io_;
    let server = httpServer;
    let server_ = server.listen(port, () => {
      cb(server_);
    });
  }
}
