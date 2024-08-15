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
const express_1 = __importDefault(require("express"));
const log_1 = __importDefault(require("../util/log"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
const Logger_1 = __importDefault(require("../middleware/server/Logger"));
const postgres_1 = require("../hooks/db/postgres");
const SocketManager_1 = require("../lib/ws/SocketManager");
const path = __importStar(require("path"));
const api_1 = __importDefault(require("../routes/api/v1/api"));
const eventLoader_1 = __importDefault(require("../events/ws/eventLoader"));
const redisHealthCheck_1 = __importDefault(require("../util/db/redisHealthCheck"));
const axios_1 = __importDefault(require("axios"));
//import "../tests/token";
const Socket = new SocketManager_1.SocketManager();
let io = Socket.io;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(Logger_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, "../../client/build")));
app.use("/api/v1", api_1.default);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});
const allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);
console.clear();
if (process.env.MODE === "prod") {
    (0, axios_1.default)({
        method: "GET",
        url: "https://api-p2p.onrender.com/",
    }).then(() => {
        console.log("Pinged!");
    });
    setInterval(() => {
        (0, axios_1.default)({
            method: "GET",
            url: "https://api-p2p.onrender.com/",
        }).then(() => {
            console.log("Pinged!");
        });
    }, 60 * 1000 * 10);
}
(0, postgres_1.Client)().then(() => {
    (0, redisHealthCheck_1.default)();
    (0, log_1.default)("{ring} Initializing API and services..", colors_1.default.dim);
    Socket.Connect(httpServer, {
        path: process.env.SOCKET_PATH,
        cookie: {
            name: "handshake-fingerprint",
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 100,
        },
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    }, Number(process.env.PORT), (server) => {
        io = Socket.io;
        (0, eventLoader_1.default)(io);
        (0, log_1.default)(`{online} API and Socket listening on ${colors_1.default.blue(`http://${server.address().address}:${server.address().port}/`)}`, colors_1.default.bold);
        (0, log_1.default)(`${colors_1.default.yellow("* To check the API status: ") + colors_1.default.blue("GET /")}`, colors_1.default.bold);
        (0, log_1.default)(`${colors_1.default.yellow("* Socket Pathway: ") +
            colors_1.default.blue(`${process.env.SOCKET_PATH}`)}`, colors_1.default.bold);
    });
});
//# sourceMappingURL=server.js.map