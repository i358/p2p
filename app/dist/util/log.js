"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const moment_1 = __importDefault(require("moment"));
exports.default = (t, fn) => {
    t = t
        .replace("{success}", "✅")
        .replace("{online}", "🟢")
        .replace("{error}", "❌")
        .replace("{disturb}", "🔴")
        .replace("{ready}", "🟡")
        .replace("{idle}", "🟠")
        .replace("{ring}", "⭕");
    console.log(`${colors_1.default.bold(colors_1.default.yellow(`[${(0, moment_1.default)().format("DD.MM.YY ~ HH:mm:ss")}] (App)`))} ${fn ? fn(t) : t}`);
};
//# sourceMappingURL=log.js.map