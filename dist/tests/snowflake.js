"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Snowflake_1 = require("../util/api/token/Snowflake");
const moment_1 = __importDefault(require("moment"));
require("./timestamp");
(async () => {
    const Snowflake = new Snowflake_1.Snowflake();
    const uid = await Snowflake.createUUID({ encoding: "none" });
    const parsed = await Snowflake.parseUUID(uid, { encoding: "none" });
    console.log(uid, Buffer.from(uid, "utf-8").toString("base64url"));
    console.log((0, moment_1.default)(Number(parsed)).format("DD.MM.YYYY HH:mm:ss"));
})();
//# sourceMappingURL=snowflake.js.map