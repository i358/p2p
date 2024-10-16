"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const Timestamp_1 = require("@util/api/token/Timestamp");
const bearerTokenValidator_1 = __importDefault(require("validators/api/bearerTokenValidator"));
let b64 = Buffer.from;
function default_1(token) {
    const Timestamp = new Timestamp_1.Timestamp();
    return new Promise((resolve, reject) => {
        (0, bearerTokenValidator_1.default)(token)
            .then(async (res) => {
            if (res === "ok") {
                let [SnowflakeID, TokenCreation, TokenHMAC] = token.split(".");
                let uid = b64(SnowflakeID, "base64url")
                    .toString("utf-8");
                let creation = await Timestamp.Parse(TokenCreation, {
                    encoding: "base64url",
                });
                resolve({ id: uid, token_createdAt: creation, hmac: TokenHMAC });
            }
            else
                reject("Unexpected Error.");
        })
            .catch(() => reject("Invalid Token."));
    });
}
//# sourceMappingURL=bearerTokenHandler.js.map