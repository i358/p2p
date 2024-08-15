import { io } from "socket.io-client";
import config from "../config/socket.config";

let { SOCKET_URI } = config;
let URL: any = SOCKET_URI;
export default {
  socket(token: any) {
    return io(URL, {
      path: "/handshake/websocket/v1",
      auth: {
        token: "Bearer " + token,
      },
    });
  },
};
