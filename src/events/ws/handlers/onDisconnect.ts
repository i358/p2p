import log from "@util/log";
import colors from "colors";
import moment from "moment";
import { RedisManager } from "@lib/db/RedisManager";
const redis = new RedisManager()
const { Exists, Get, Set } = redis;

export default async function (io:any, u:any, r:any) {
  delete u.user["email"]
  delete u.user["permLevels"]
  delete u.user["pgid"]

  let exists = await Exists("online")
  if(exists) {
let uList_:string[] = []
   let uList:any = await Get("online")
   uList_ = JSON.parse(uList);
   uList_ = uList_.filter((n:any)=>n!==u.user.id)
   
   Set({key:"online", val:JSON.stringify(uList_)})
   io.emit("MEMBER_LEFT", u.user);
 log(`${colors.red("-> "+u.user.username+` (${u.user.id})`)} left the websocket with ${colors
  .red(r)} reason.`, colors.bold)
}

}