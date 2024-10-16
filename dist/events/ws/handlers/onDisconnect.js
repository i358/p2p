"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const log_1 = __importDefault(require("@util/log"));
const colors_1 = __importDefault(require("colors"));
const RedisManager_1 = require("@lib/db/RedisManager");
const redis = new RedisManager_1.RedisManager();
const { Exists, Get, Set } = redis;
async function default_1(io, u, r) {
    delete u.user["email"];
    delete u.user["permLevels"];
    delete u.user["pgid"];
    let exists = await Exists("online");
    if (exists) {
        let uList_ = [];
        let uList = await Get("online");
        uList_ = JSON.parse(uList);
        uList_ = uList_.filter((n) => n !== u.user.id);
        Set({ key: "online", val: JSON.stringify(uList_) });
        io.emit("MEMBER_LEFT", u.user);
        (0, log_1.default)(`${colors_1.default.red("-> " + u.user.username + ` (${u.user.id})`)} left the websocket with ${colors_1.default
            .red(r)} reason.`, colors_1.default.bold);
    }
}
//# sourceMappingURL=onDisconnect.js.map