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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const Logger_1 = __importDefault(require("../middleware/server/Logger"));
const SocketManager_1 = require("../lib/ws/SocketManager");
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const Socket = new SocketManager_1.SocketManager();
let io = Socket.io;
let { SITE_DOMAIN } = process.env;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.set('trust proxy', true);
app.use(express_1.default.json());
app.use(Logger_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path.join(__dirname, "../../client/dist")));
app.use(express_1.default.static(path.join(__dirname, "../../public")));
//app.use("/api/v1", APIV1Router);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});
console.clear();
if (process.env.MODE === "prod") {
    (0, axios_1.default)({
        method: "GET",
        url: SITE_DOMAIN,
    }).then(() => {
        console.log("Pinged!");
    });
    setInterval(() => {
        (0, axios_1.default)({
            method: "GET",
            url: SITE_DOMAIN,
        }).then(() => {
            console.log("Pinged!");
        });
    }, 60 * 1000 * 10);
}
/*PostgresClient().then(() => {
    redisHealthCheck();
    log("{ring} Initializing API and services..", colors.dim);
    Socket.Connect(
        httpServer,
        {
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

        },
        Number(process.env.PORT),
        (server: any) => {
            io = Socket.io;
            SocketEventLoader(io);
            log(
                `{online} API and Socket listening on ${colors.blue(
                    `http://${server.address().address}:${server.address().port}/`
                )}`,
                colors.bold
            );
            log(
                `${
                    colors.yellow("* To check the API status: ") + colors.blue("GET /")
                }`,
                colors.bold
            );
            log(
                `${
                    colors.yellow("* Socket Pathway: ") +
                    colors.blue(`${process.env.SOCKET_PATH}`)
                }`,
                colors.bold
            );
        }
    );
});
*/
httpServer.listen(80, () => {
    console.log("ok");
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
//# sourceMappingURL=server.js.map