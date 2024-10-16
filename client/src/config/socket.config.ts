import config from "./app.json"
const {isDevelopment, SOCKET} = config
export default {
  SOCKET_URI: isDevelopment
    ? "http://localhost"
    : SOCKET.URI,
  SOCKET_PATH(){
    return SOCKET.PATH
  }
};
 