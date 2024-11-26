import fs from "fs";
import log from "@util/log";
import colors from "colors";
import * as path from "path";
import onConnection from "./handlers/onConnection";
import onDisconnect from "./handlers/onDisconnect";
import SocketAuthMiddleware from "@middleware/websocket/auth";

export default function (io: any) {
  io.on("connection", (socket: any) => {
    onConnection(io, socket);
    const eventsPath = path.join(__dirname, "listeners");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if ("on" in event && "execute" in event) {
        socket.on(event.on, (...args: any) =>
          event.execute(io, socket, ...args)
        );
      } else {
        log(
          "{error} 'on' or 'execute' is missing in the " + file + " event.",
          colors.red
        );
      }
    }
    socket.on("disconnect", (r:any)=>onDisconnect(io, socket, r));
  });

  io.use(SocketAuthMiddleware);
}
