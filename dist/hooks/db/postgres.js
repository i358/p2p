"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = Client;
const log_1 = __importDefault(require("@util/log"));
const colors_1 = __importDefault(require("colors"));
const pgHealthCheck_1 = __importDefault(require("@util/db/pgHealthCheck"));
const PostgresManager_1 = require("@lib/db/PostgresManager");
function Client() {
    return new Promise((resolve, reject) => {
        (0, log_1.default)("{ring} Initializing PostgreSQL Client...", colors_1.default.dim);
        const Postgres = new PostgresManager_1.PostgresManager.Postgres();
        Postgres.Connect()
            .then((client) => {
            (0, log_1.default)("{ready} PostgreSQL Client successfully initialized, checking for cluster health..", colors_1.default.yellow);
            (0, pgHealthCheck_1.default)()
                .then(() => {
                (0, log_1.default)(`{online} ${colors_1.default.bgGreen("OK! Cluster is working properly.")}`, colors_1.default.bold);
                resolve(client);
            })
                .catch((err) => (0, log_1.default)("{error} " + err, colors_1.default.red));
        })
            .catch((err) => {
            (0, log_1.default)("{error} An error occurred while initializing PostgreSQL Client: " +
                err, colors_1.default.red);
            resolve(false);
        });
    });
}
//# sourceMappingURL=postgres.js.map