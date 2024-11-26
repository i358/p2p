"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snowflake_1 = require("../util/api/token/Snowflake");
const Timestamp_1 = require("../util/api/token/Timestamp");
const crypter_1 = require("../lib/security/crypter");
const moment_1 = __importDefault(require("moment"));
(async () => {
    const Snowflake = new Snowflake_1.Snowflake(1n);
    const Timestamp = new Timestamp_1.Timestamp();
    const MD5 = new crypter_1.Crypter.MD5();
    const HMAC = new crypter_1.Crypter.HMAC();
    const k = await MD5.create("abc15ABC½½$&", { encoding: "none" });
    let metadata = await MD5.create({ username: "X", email: "x@peer2p.online" }, { encoding: "base64url" });
    console.log((0, moment_1.default)().valueOf());
    let p1 = await Snowflake.createUUID({ encoding: "none" });
    let p2 = await Timestamp.Convert({ encoding: "base64url" }, "none");
    let p3 = await HMAC.create(metadata, k, { encoding: "base64url" });
    let pwValidator = (await HMAC.validate(p3, k, metadata, { encoding: "base64url" }))
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
//# sourceMappingURL=token.js.map