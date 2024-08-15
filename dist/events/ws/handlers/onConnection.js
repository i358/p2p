"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const log_1 = __importDefault(require("../../../util/log"));
const colors_1 = __importDefault(require("colors"));
const RedisManager_1 = require("../../../lib/db/RedisManager");
const redis = new RedisManager_1.RedisManager();
const { Exists, Set, Get } = redis;
async function default_1(io, socket) {
    if (!socket.token)
        socket.disconnect();
    delete socket.user["email"];
    delete socket.user["permLevels"];
    delete socket.user["pgid"];
    let exists = await Exists("online");
    let uList__ = [];
    uList__.push(socket.user.id);
    if (!exists)
        Set({ key: "online", val: JSON.stringify(uList__) });
    else {
        let uList_ = [];
        let uList = await Get("online");
        uList_ = JSON.parse(uList);
        if (!uList_.includes(socket.user.id)) {
            uList_.push(socket.user.id);
            Set({ key: "online", val: JSON.stringify(uList_) });
            io.emit("MEMBER_JOIN", socket.user);
        }
    }
    (0, log_1.default)(`${colors_1.default.blue("-> " + socket.user.username + ` (${socket.user.id})`)} connected the websocket.`, colors_1.default.bold);
}
//# sourceMappingURL=onConnection.js.map