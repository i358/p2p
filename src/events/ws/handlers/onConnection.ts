import log from "@util/log";
import colors from "colors";
import moment from "moment";
import { RedisManager } from "@lib/db/RedisManager";
const redis = new RedisManager()
const { Exists, Set, Get } = redis;

export default async function (io: any, socket: any) {
  if (!socket.token) socket.disconnect();
  delete socket.user["email"]
  delete socket.user["permLevels"]
  delete socket.user["pgid"]

  let exists = await Exists("online")
  let uList__ = []
  uList__.push(socket.user.id)
  
  if(!exists) Set({key:"online", val:JSON.stringify(uList__)})
  else {
let uList_:string[] = []
   let uList:any = await Get("online")
   uList_ = JSON.parse(uList);
   if(!uList_.includes(socket.user.id)){
    uList_.push(socket.user.id)
    
   Set({key:"online", val:JSON.stringify(uList_)})
   
  io.emit("MEMBER_JOIN", socket.user);
   }
  }
  log(`${colors.blue("-> "+socket.user.username+` (${socket.user.id})`)} connected the websocket.`,
   colors.bold)
}
