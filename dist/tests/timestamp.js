"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timestamp_1 = require("@util/api/token/Timestamp");
const moment_1 = __importDefault(require("moment"));
(async () => {
    const Timestamp = new Timestamp_1.Timestamp();
    const ts = await Timestamp.Convert({ encoding: "base64url" }, "none");
    const tsC = await Timestamp.Parse(ts, { encoding: "base64url" });
    console.log(ts);
    console.log((0, moment_1.default)(tsC).format("DD.MM.YYYY HH:mm:ss"));
})();
//# sourceMappingURL=timestamp.js.map