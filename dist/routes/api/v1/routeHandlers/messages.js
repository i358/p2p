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
const express_1 = require("express");
const PostgresManager_1 = require("../../../../lib/db/PostgresManager");
const SocketManager_1 = require("../../../../lib/ws/SocketManager");
const Snowflake_1 = require("../../../../util/api/token/Snowflake");
const userCheck_1 = __importDefault(require("../../../../hooks/api/userCheck"));
const auth_1 = __importDefault(require("../../../../middleware/api/auth"));
const multer_1 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const moment_1 = __importDefault(require("moment"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const snowflake = new Snowflake_1.Snowflake(3n);
        snowflake.createUUID({ encoding: "none" }).then((attachmentId) => {
            cb(null, attachmentId + path.extname(file.originalname));
        });
    },
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Sadece resim ve gif dosyaları kabul edilir!"), false);
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
});
const router = (0, express_1.Router)();
const Postgres = new PostgresManager_1.PostgresManager.Postgres();
const SocketInstance = new SocketManager_1.SocketManager();
const Socket = SocketInstance.Instance();
router.post("/", auth_1.default, (req, res) => {
    Postgres.Find({ table: "messages" }).then((messages) => {
        let m = [];
        if (messages.rows.length < 1) {
            res.json([]);
        }
        else {
            messages.rows.map((message) => {
                Postgres.FindOne({
                    table: "users",
                    keys: ["id"],
                    values: [message.senderId],
                }).then((sender) => {
                    let s_;
                    if (sender.id && sender.username)
                        s_ = sender;
                    else
                        s_ = {
                            id: 0,
                            username: "Deleted User",
                            color: "FFFF",
                            createdAt: 0,
                        };
                    m.push({
                        id: Number(message.id),
                        createdAt: Number(message.createdAt),
                        sender: {
                            id: Number(s_.id),
                            username: s_.username,
                            color: s_.color,
                            createdAt: Number(s_.createdAt),
                        },
                        content: message.content,
                        attachments: JSON.parse(message.attachments),
                    });
                    if (m.length === messages.rows.length)
                        send();
                });
            });
            const send = () => {
                res.json(m);
            };
        }
    });
});
router.post("/send", auth_1.default, upload.array("images"), async (req, res) => {
    let { authorization } = req.headers;
    (0, userCheck_1.default)(authorization.split(" ")[1])
        .then((uid) => {
        Postgres.FindOne({
            table: "users",
            keys: ["id"],
            values: [uid.id],
        }).then(async (user) => {
            let { message } = req.body;
            message = JSON.parse(message);
            if (!message || !message.content)
                res.json({
                    error: "Message or message properties is missing.",
                    status: { code: 11, description: "MISSING_FORM_MEMBER" },
                });
            else {
                const Snowflake = new Snowflake_1.Snowflake(2n);
                let mid_ = await Snowflake.createUUID({ encoding: "none" });
                let dateNow = (0, moment_1.default)().valueOf();
                let m = {
                    id: mid_,
                    sender: {
                        username: user.username,
                        id: user.id,
                        color: user.color,
                    },
                    content: message.content,
                    createdAt: dateNow,
                    token: message.token,
                    attachments: [],
                    isSent: true,
                };
                function handleUpload(req, res, next) {
                    let attachmentIds = [];
                    if (req.files && req.files.length > 0) {
                        req.files.forEach((file) => {
                            const [id, ext] = file.filename.split(".");
                            attachmentIds.push(id + "." + ext);
                        });
                        next(attachmentIds);
                    }
                }
                const save = (attachmentIds) => {
                    m.attachments = attachmentIds || [];
                    Postgres.Create({
                        table: "messages",
                        keys: ["id", "senderId", "content", "createdAt", "attachments"],
                        values: [
                            mid_,
                            user.id,
                            message.content,
                            dateNow,
                            JSON.stringify(m.attachments),
                        ],
                    }).then(() => {
                        Socket.emit("send", { to: "message" }, m);
                        res.json(m);
                    });
                };
                if (req.files && req.files.length > 0) {
                    handleUpload(req, res, function (attachmentIds) {
                        save(attachmentIds);
                    });
                }
                else if (message.content) {
                    save([]);
                }
            }
        });
    })
        .catch((e) => res.json({ error: e }));
});
exports.default = router;
//# sourceMappingURL=messages.js.map