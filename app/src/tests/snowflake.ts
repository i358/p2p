import { Snowflake as SnowflakeInstance } from "@util/api/token/Snowflake";
import moment from 'moment';
import "./timestamp"

(async()=>{
    const Snowflake = new SnowflakeInstance()

    const uid = await Snowflake.createUUID({encoding:"none"});
    const parsed = await Snowflake.parseUUID(uid, {encoding:"none"})
      console.log(uid, Buffer.from(uid, "utf-8").toString("base64url"))
      console.log(moment(Number(parsed)).format("DD.MM.YYYY HH:mm:ss"))
    })()
    