import moment from "moment";
import log from "@util/log";
import { RedisManager } from "@lib/db/RedisManager";
import colors from "colors";

const redis = new RedisManager();
let { Get, Set, Delete } = redis;

export default async() => {
    let now = moment().valueOf()
    Set({key:"log."+now, val:"success"})
    let res = await Get("log."+now)
    if(res==="success"){
     Delete("log."+now)
     log("{online} "+colors.bgGreen("OK! Redis server is working properly"), colors.bold)
    }
    else log("{disturb} "+ colors.bgRed("Redis server isn't working properly. An Error Occurred."), colors.bold)
};
