"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
const base64url_1 = __importDefault(require("base64url"));
const moment_1 = __importDefault(require("moment"));
class Timestamp {
    async Convert(config, timestamp) {
        const epoch = Number(process.env.EPOCH_TIMESTAMP);
        const currentTimestamp = timestamp === "none" ? (0, moment_1.default)().valueOf() : timestamp;
        const secondsSinceEpoch = currentTimestamp - epoch;
        const hexTimestamp = secondsSinceEpoch.toString(16);
        const buffer = Buffer.from(hexTimestamp, "hex");
        let base64urlTimestamp = buffer.toString("base64");
        base64urlTimestamp = base64url_1.default.fromBase64(base64urlTimestamp);
        return config.encoding === "base64url"
            ? base64urlTimestamp
            : config.encoding == "hex"
                ? buffer.toString("hex")
                : false;
    }
    async Parse(base64urlTimestamp, config) {
        return new Promise((resolve, reject) => {
            const buffer = Buffer.from(base64urlTimestamp, config.encoding);
            const hexTimestamp = buffer.toString("hex");
            const secondsSinceEpoch = parseInt(hexTimestamp, 16);
            const epoch = Number(process.env.EPOCH_TIMESTAMP);
            const currentTimestamp = epoch + secondsSinceEpoch;
            resolve(currentTimestamp);
        });
    }
}
exports.Timestamp = Timestamp;
//# sourceMappingURL=Timestamp.js.map