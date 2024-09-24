"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypter = void 0;
const crypto = __importStar(require("crypto"));
const base64url_1 = __importDefault(require("base64url"));
var Crypter;
(function (Crypter) {
    class AES256CBC {
        encrypt(payload, secret) {
            return new Promise((resolve, reject) => {
                const initVector = secret?.iv || crypto.randomBytes(16);
                const Securitykey = secret?.key || crypto.randomBytes(32);
                try {
                    const cipher = crypto.createCipheriv("aes-256-cbc", Securitykey, initVector);
                    let encryptedData = cipher.update(payload, "utf-8", "hex");
                    encryptedData += cipher.final("hex");
                    const ivHex = Buffer.from(initVector).toString("base64");
                    const keyHex = Buffer.from(Securitykey).toString("base64");
                    resolve({
                        hash: encryptedData,
                        secret: {
                            iv: Buffer.from(ivHex).toString("hex"),
                            key: Buffer.from(keyHex).toString("hex"),
                        },
                    });
                }
                catch (err) {
                    reject(err.message);
                }
            });
        }
        /**
         *
         *
         * @param {*} encryptedPayload
         * @param {({ iv: Buffer; key: Buffer } | any)} secret
         * @return {*}  {Promise<Object>}
         * @memberof AES256CBC
         */
        decrypt(encryptedPayload, secret) {
            return new Promise((resolve, reject) => {
                try {
                    const encryptedData = Buffer.from(encryptedPayload, "hex");
                    const iv = Buffer.from(Buffer.from(secret.iv, "hex")
                        .toString("utf-8"), "base64");
                    const key = Buffer.from(Buffer.from(secret.key, "hex")
                        .toString("utf-8"), "base64");
                    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
                    let decryptedData = decipher.update(encryptedData);
                    decryptedData = Buffer.concat([decryptedData, decipher.final()]);
                    resolve(JSON.parse(decryptedData.toString("utf-8")));
                }
                catch (err) {
                    reject(err.message);
                }
            });
        }
    }
    Crypter.AES256CBC = AES256CBC;
    class HMAC {
        create(payload, secret, config) {
            return new Promise(async (resolve, reject) => {
                const hmac = crypto.createHmac("sha256", secret);
                hmac.update(payload);
                let result = hmac.digest(config.encoding);
                result =
                    config.encoding === "base64url"
                        ? base64url_1.default.fromBase64(result)
                        : result;
                resolve(result);
            });
        }
        validate(hash, secret, validator, config) {
            return new Promise((resolve, reject) => {
                const i = Buffer.from(hash, config.encoding)
                    .toString("hex");
                const hmac = crypto.createHmac("sha256", secret);
                hmac.update(validator);
                const res = hmac.digest("hex");
                if (i === res) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        }
    }
    Crypter.HMAC = HMAC;
    class MD5 {
        create(payload, config) {
            return new Promise((resolve, reject) => {
                let hash = crypto.createHash("md5");
                payload =
                    typeof payload === "object" ? JSON.stringify(payload) : payload;
                hash.update(payload);
                let res = hash.digest("hex");
                res =
                    config.encoding === "base64url"
                        ? base64url_1.default.fromBase64(Buffer.from(res, "hex")
                            .toString("base64"))
                        : res;
                resolve(res);
            });
        }
    }
    Crypter.MD5 = MD5;
})(Crypter || (exports.Crypter = Crypter = {}));
//# sourceMappingURL=crypter.js.map