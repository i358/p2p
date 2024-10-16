"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const PostgresManager_1 = require("@lib/db/PostgresManager");
const bearerTokenHandler_1 = __importDefault(require("handlers/api/bearerTokenHandler"));
function default_1(token) {
    return new Promise((resolve, reject) => {
        const Postgres = new PostgresManager_1.PostgresManager.Postgres();
        (0, bearerTokenHandler_1.default)(token)
            .then((data) => {
            Postgres.FindOne({ table: "users", keys: ["id"], values: [data.id] })
                .then((user) => {
                if (user && user.id) {
                    Postgres.FindOne({
                        table: "secrets",
                        keys: ["secret"],
                        values: [data.hmac],
                    }).then((s) => {
                        if (s.secret) {
                            resolve(user);
                        }
                        else {
                            reject("User not found.");
                        }
                    });
                }
                else
                    reject("User not found.");
            })
                .catch(() => reject("User not found."));
        })
            .catch(() => reject("Invalid token."));
    });
}
//# sourceMappingURL=userCheck.js.map