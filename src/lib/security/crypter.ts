"use strict";
import * as crypto from "crypto";
import base64url from "base64url";

export namespace Crypter {
  export class AES256CBC {
    encrypt(payload: any, secret?: { iv: any; key: any }): Promise<Object> {
      return new Promise<Object>((resolve, reject) => {
        const initVector: Buffer = secret?.iv || crypto.randomBytes(16);
        const Securitykey: Buffer = secret?.key || crypto.randomBytes(32);
        try {
          const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            Securitykey,
            initVector
          );
          let encryptedData: string = cipher.update(payload, "utf-8", "hex");
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
        } catch (err: any) {
          reject(err.message);
        }
      });
    }
    decrypt(
      encryptedPayload: any,
      secret: { iv: Buffer; key: Buffer } | any
    ): Promise<Object> {
      return new Promise<Object>((resolve, reject) => {
        try {
          const encryptedData = Buffer.from(encryptedPayload, "hex");
          const iv = Buffer.from(
            Buffer.from(secret.iv, "hex")
            .toString("utf-8"),
            "base64"
          );
          const key = Buffer.from(
            Buffer.from(secret.key, "hex")
            .toString("utf-8"),
            "base64"
          );

          const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
          let decryptedData: Buffer = decipher.update(encryptedData);
          decryptedData = Buffer.concat([decryptedData, decipher.final()]);
          resolve(JSON.parse(decryptedData.toString("utf-8")));
        } catch (err: any) {
          reject(err.message);
        }
      });
    }
  }
  export class HMAC {
    create(
      payload: any,
      secret: any,
      config: { encoding: "hex" | "base64url" }
    ): Promise<any> {
      return new Promise(async (resolve, reject) => {
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(payload);
        let result = hmac.digest(config.encoding);
        result =
          config.encoding === "base64url"
            ? base64url.fromBase64(result)
            : result;
        resolve(result);
      });
    }
    validate(
      hash: any,
      secret: any,
      validator: any,
      config: { encoding: "hex" | "base64url" }
    ): Promise<boolean> {
      return new Promise((resolve, reject) => {
        const i = Buffer.from(hash, config.encoding)
        .toString("hex");
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(validator);
        const res = hmac.digest("hex");
        if (i === res) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }
  }
  export class MD5 {
    create(
      payload: any,
      config: { encoding: "none" | "base64url" }
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        let hash = crypto.createHash("md5");
        payload =
          typeof payload === "object" ? JSON.stringify(payload) : payload;
        hash.update(payload);
        let res = hash.digest("hex");
        res =
          config.encoding === "base64url"
            ? base64url.fromBase64(Buffer.from(res, "hex")
            .toString("base64"))
            : res;
        resolve(res);
      });
    }
  }
}
