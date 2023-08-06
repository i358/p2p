import { io } from "socket.io-client";
import { config } from "./socket.config.d";

let { SOCKET_URI } = config;

let URL: any = SOCKET_URI || "https://localhost:3000";
export const socket = io(URL);
