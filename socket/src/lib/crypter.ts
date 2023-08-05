"use strict";
import * as crypto from 'crypto'
interface Secret { iv?: Buffer, key?: Buffer }
export class Crypter {
    encrypt(payload: any, secret?:Secret): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            const initVector: Buffer = secret?.iv || crypto.randomBytes(16)
            const Securitykey: Buffer = secret?.key || crypto.randomBytes(32)
            try {
                const cipher = crypto.createCipheriv('aes-256-cbc', Securitykey, initVector);
                let encryptedData: string = cipher.update(payload, "utf-8", "hex");
                encryptedData += cipher.final("hex");
                resolve({
                    hash:encryptedData, secret: {
                        iv:Buffer.from(initVector).toString("hex"),
                        key:Buffer.from(Securitykey).toString("hex"),
                    }
                });
            } catch (err: any){ reject(err.message) }
        })
    }
}