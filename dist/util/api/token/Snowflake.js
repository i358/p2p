"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
const base64url_1 = __importDefault(require("base64url"));
const moment_1 = __importDefault(require("moment"));
class Snowflake {
    constructor(workerId = 1n, epoch = BigInt(Number(process.env.EPOCH_TIMESTAMP))) {
        this.workerId = workerId;
        this.epoch = epoch;
        this.sequence = 0n;
        this.lastTimestamp = -1n;
    }
    createUUID(config, timestamp = BigInt((0, moment_1.default)().valueOf())) {
        return new Promise((resolve, reject) => {
            if (timestamp < this.lastTimestamp) {
                throw new Error("Invalid system clock");
            }
            if (timestamp === this.lastTimestamp) {
                this.sequence = (this.sequence + 1n) & 4095n;
                if (this.sequence === 0n) {
                    // Wait for next millisecond
                    timestamp = this.waitNextMillis(timestamp);
                }
            }
            else {
                this.sequence = 0n;
            }
            this.lastTimestamp = timestamp;
            const snowflake = ((timestamp - this.epoch) << 22n) |
                (this.workerId << 12n) |
                this.sequence;
            let res = config.encoding === "base64url"
                ? base64url_1.default.fromBase64(Buffer.from(snowflake.toString(), "utf-8").toString("base64"))
                : snowflake.toString();
            resolve(res);
        });
    }
    currentTimestamp() {
        return BigInt(moment_1.default.utc().valueOf());
    }
    waitNextMillis(timestamp) {
        while (timestamp <= this.lastTimestamp || this.sequence >= 4096n) {
            timestamp = this.currentTimestamp();
        }
        return timestamp;
    }
    parseUUID(uid, config) {
        return new Promise((resolve, reject) => {
            if (!uid)
                reject(new Error("Snowflake ID is missing."));
            uid =
                config.encoding === "base64url"
                    ? Buffer.from(uid, "base64url").toString("utf-8")
                    : uid;
            const snowflake = BigInt(uid);
            const timestamp = (snowflake >> 22n) + this.epoch;
            resolve(timestamp);
        });
    }
}
exports.Snowflake = Snowflake;
//# sourceMappingURL=Snowflake.js.map