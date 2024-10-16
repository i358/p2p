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
exports.default = default_1;
const fs_1 = __importDefault(require("fs"));
const log_1 = __importDefault(require("@util/log"));
const colors_1 = __importDefault(require("colors"));
const path = __importStar(require("path"));
const onConnection_1 = __importDefault(require("./handlers/onConnection"));
const onDisconnect_1 = __importDefault(require("./handlers/onDisconnect"));
const auth_1 = __importDefault(require("@middleware/websocket/auth"));
function default_1(io) {
    io.on("connection", (socket) => {
        (0, onConnection_1.default)(io, socket);
        const eventsPath = path.join(__dirname, "listeners");
        const eventFiles = fs_1.default
            .readdirSync(eventsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if ("on" in event && "execute" in event) {
                socket.on(event.on, (...args) => event.execute(io, socket, ...args));
            }
            else {
                (0, log_1.default)("{error} 'on' or 'execute' is missing in the " + file + " event.", colors_1.default.red);
            }
        }
        socket.on("disconnect", (r) => (0, onDisconnect_1.default)(io, socket, r));
    });
    io.use(auth_1.default);
}
//# sourceMappingURL=eventLoader.js.map