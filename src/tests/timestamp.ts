import { Timestamp as TimestampInstance } from "@util/api/token/Timestamp";
import moment from "moment";

(async () => {
  const Timestamp = new TimestampInstance();
  const ts = await Timestamp.Convert({encoding:"base64url"}, "none")
  const tsC = await Timestamp.Parse(ts, {encoding:"base64url"})
  console.log(ts);
  console.log(moment(tsC).format("DD.MM.YYYY HH:mm:ss"))

})();
  