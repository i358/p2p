import { isBase64 } from "validator";

let b64 = Buffer.from;

export default function (token: any) {
  return new Promise(async (resolve, reject) => {
    let [SnowflakeID, TokenCreation, TokenHMAC] = token.split(".");
    if (SnowflakeID && TokenCreation && TokenHMAC) {
      let ID = b64(SnowflakeID, "base64url").toString("utf-8");
      if (ID.length >= 12) {
        resolve("ok");
      } else reject("Invalid token.");
    } else reject("Invalid token.");
  });
}
