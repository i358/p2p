"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//@ts-ignore
const ascii_table_1 = __importDefault(require("ascii-table"));
const log_1 = __importDefault(require("../../util/log"));
const colors_1 = __importDefault(require("colors"));
function default_1(req, res, next) {
    let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    let table = new ascii_table_1.default();
    table
        .setHeading("Ref", "Content")
        .addRow("Method", req.method)
        .addRow("Path", req.path)
        .addRow("Address", ip)
        .addRow("Status", `${res.statusCode}`)
        .addRow("Params", JSON.stringify(req.query));
    (0, log_1.default)("\n" +
        colors_1.default.blue(`${req.method} ${colors_1.default.bgBlue(colors_1.default.white(req.path))}`) +
        "\n" +
        table.toString(), colors_1.default.bold);
    next();
}
//# sourceMappingURL=Logger.js.map