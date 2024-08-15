"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
let b64 = Buffer.from;
function default_1(token) {
    return new Promise(async (resolve, reject) => {
        let [SnowflakeID, TokenCreation, TokenHMAC] = token.split(".");
        if (SnowflakeID && TokenCreation && TokenHMAC) {
            let ID = b64(SnowflakeID, "base64url").toString("utf-8");
            if (ID.length >= 12) {
                resolve("ok");
            }
            else
                reject("Invalid token.");
        }
        else
            reject("Invalid token.");
    });
}
//# sourceMappingURL=bearerTokenValidator.js.map