"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const crypter_1 = require("../../lib/security/crypter");
const moment_1 = __importDefault(require("moment"));
const log_1 = __importDefault(require("../log"));
const PostgresManager_1 = require("../../lib/db/PostgresManager");
const colors_1 = __importDefault(require("colors"));
function default_1() {
    const Postgres = new PostgresManager_1.PostgresManager.Postgres();
    return new Promise(async (resolve, reject) => {
        const crypter = new crypter_1.Crypter.AES256CBC();
        let verifyC = { ts_: (0, moment_1.default)().format("DD-MM-YYYY.HH_mm_ss") };
        let op = await crypter
            //@ts-ignore
            .encrypt(JSON.stringify(verifyC), {
            iv: Buffer.from(`0${(0, moment_1.default)().format("DDMMYYYYHHmmss")}0`),
        })
            .catch(reject);
        (0, log_1.default)("{ring} Initializing cluster health check...", colors_1.default.dim);
        Postgres.Create({
            table: "logs",
            keys: [
                "type",
                "message",
                "readChannel",
                "verifyChannel",
                "createdAt",
                "cache",
            ],
            values: [
                "SystemHealthCheck",
                "PostgreSQL Client initialized, checked cluster health.",
                op.secret.key,
                op.secret.iv,
                (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
                op.hash,
            ],
        })
            .then(() => {
            Postgres.FindOne({
                table: "logs",
                keys: ["readChannel", "verifyChannel", "cache"],
                values: [op.secret.key, op.secret.iv, op.hash],
            })
                .then(async (row) => {
                if (row && row.cache) {
                    let ec = await crypter
                        .decrypt(row.cache, {
                        iv: row.verifyChannel,
                        key: row.readChannel,
                    })
                        .catch(reject);
                    if (ec && ec.ts_) {
                        /*const del = () => {
                          client.query(`DELETE FROM "logs" WHERE "readChannel"=$1 AND "verifyChannel"=$2 AND "cache"=$3`, [op.secret.key, op.secret.iv, op.hash])
                        }*/
                        if (ec.ts_ === verifyC.ts_) {
                            resolve(true);
                            //del();
                        }
                        else {
                            reject("Cluster isn't working properly.");
                            //del();
                        }
                    }
                }
            })
                .catch((err) => reject("Postgres query error => " + err));
        })
            .catch((err) => reject("Cluster error => " + err));
    });
}
//# sourceMappingURL=pgHealthCheck.js.map