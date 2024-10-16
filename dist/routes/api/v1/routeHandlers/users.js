"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("@middleware/api/auth"));
const userCheck_1 = __importDefault(require("@hooks/api/userCheck"));
const RedisManager_1 = require("@lib/db/RedisManager");
const PostgresManager_1 = require("@lib/db/PostgresManager");
const Redis = new RedisManager_1.RedisManager();
const router = (0, express_1.Router)();
const Postgres = new PostgresManager_1.PostgresManager.Postgres();
let { Get, Exists } = Redis;
router.post("/", auth_1.default, async (req, res) => {
    let { authorization } = req.headers;
    (0, userCheck_1.default)(authorization.split(" ")[1])
        .then((uck_) => {
        Postgres.FindOne({
            table: "users",
            keys: ["id"],
            values: [uck_.id],
        }).then((user) => {
            let perms = [];
            let [_, cperms, uperms, mperms, aperms] = user.permLevels.split(",");
            if (user && user.id) {
                let user_ = {
                    id: user.id,
                    username: user.username,
                    color: user.color,
                    email: user.email,
                    createdAt: user.createdAt,
                    perms,
                };
                res.json(user_);
            }
            else
                res.json({
                    error: "User not found matching this token or token is invalid.",
                });
        });
    })
        .catch((error) => res.json({
        error,
    }));
});
router.post("/all", auth_1.default, async (req, res) => {
    try {
        let users = await Postgres.Find({
            table: "users",
            pick: ["id", "username", "color", "createdAt"],
        });
        let exists = await Exists("online");
        if (!exists) {
            return res.json({ online: [], offline: users.rows });
        }
        let onlineUsers_ = [];
        let onlineUsers = await Get("online");
        onlineUsers_ = JSON.parse(onlineUsers);
        const fetchUserPromises = onlineUsers_.map(async (id) => {
            try {
                const usr = await Postgres.FindOne({
                    table: "users",
                    keys: ["id"],
                    values: [id],
                    pick: ["id", "username", "color", "createdAt"]
                });
                return usr;
            }
            catch (error) {
                console.error(`Error fetching user with id ${id}:`, error);
                return null;
            }
        });
        let ouList = (await Promise.all(fetchUserPromises)).filter((usr) => usr !== null);
        res.send({
            online: ouList,
            offline: users.rows.filter((u) => !ouList.some((onlineUser) => onlineUser.id === u.id))
        });
    }
    catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map