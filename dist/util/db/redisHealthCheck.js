"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const log_1 = __importDefault(require("@util/log"));
const RedisManager_1 = require("@lib/db/RedisManager");
const colors_1 = __importDefault(require("colors"));
const redis = new RedisManager_1.RedisManager();
let { Get, Set, Delete } = redis;
exports.default = async () => {
    let now = (0, moment_1.default)().valueOf();
    Set({ key: "log." + now, val: "success" });
    let res = await Get("log." + now);
    if (res === "success") {
        Delete("log." + now);
        (0, log_1.default)("{online} " + colors_1.default.bgGreen("OK! Redis server is working properly"), colors_1.default.bold);
    }
    else
        (0, log_1.default)("{disturb} " + colors_1.default.bgRed("Redis server isn't working properly. An Error Occurred."), colors_1.default.bold);
};
//# sourceMappingURL=redisHealthCheck.js.map