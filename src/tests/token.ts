import { Snowflake as SnowflakeInstance } from "@util/api/token/Snowflake";
import { Timestamp as TimestampInstance } from "@util/api/token/Timestamp";
import { Crypter } from "@lib/security/crypter";
import jwt from "jsonwebtoken";
import moment from "moment";
import base64url from "base64url";

(async () => {
  const Snowflake = new SnowflakeInstance(1n);
  const Timestamp = new TimestampInstance();
  const MD5 = new Crypter.MD5();
  const HMAC = new Crypter.HMAC();
  const k = await MD5.create("abc15ABC½½$&", { encoding: "none" });
  let metadata = await MD5.create(
    { username: "X", email: "x@peer2p.online" },
    { encoding: "base64url" }
  );
  console.log(moment().valueOf())
  let p1 = await Snowflake.createUUID({ encoding: "none" });
  let p2 = await Timestamp.Convert({ encoding: "base64url"}, "none");
  let p3 = await HMAC.create(metadata, k, { encoding: "base64url" });
  let pwValidator = (await HMAC.validate(
    p3, 
    k,
    metadata,
    { encoding: "base64url" }
  ))
    ? "Başarılı"
    : "Başarısız";
  console.log(pwValidator);
  console.log(`${p1}.${p2}.${p3}`); 

  /* console.log(`
    Kullanıcı ID : ${Buffer.from(p1, "base64url").toString("utf-8")}
    Token oluşturulma tarihi : ${moment(decodedTimestamp).format("DD.MM.YYYY HH:mm:ss")}
    Email: ${email.mail}
    Şifre: ${password}
    Giriş ${pwValidator}
    `)*/
  // console.log(await HMAC.validate(base64urlR, k, m))
})();
