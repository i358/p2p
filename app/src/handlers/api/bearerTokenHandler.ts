import { Timestamp as TimestampInstance } from "@util/api/token/Timestamp";
import validate from "validators/api/bearerTokenValidator";
let b64 = Buffer.from;

export default function (token: any) {
  const Timestamp = new TimestampInstance();
  return new Promise((resolve, reject) => {
    validate(token)
      .then(async (res) => {
        if (res === "ok") {
          let [SnowflakeID, TokenCreation, TokenHMAC] = token.split(".");
          let uid = b64(SnowflakeID, "base64url")
          .toString("utf-8");
          let creation = await Timestamp.Parse(TokenCreation, {
            encoding: "base64url",
          });
          resolve({ id: uid, token_createdAt: creation, hmac: TokenHMAC });
        } else reject("Unexpected Error.");
      })
      .catch(() => reject("Invalid Token."));
  });
}
