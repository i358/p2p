"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xml_1 = __importDefault(require("xml"));
function default_1(req, res, next) {
    res.type("application/xml");
    res.status(404);
    let resp = {
        ServerResponse: [
            {
                Route: req.path,
            },
            {
                Method: req.method,
            },
            {
                Status: res.statusCode,
            },
            {
                Content: "The page you search is not found.",
            },
        ],
    };
    res.send((0, xml_1.default)(resp, { declaration: true }));
}
//# sourceMappingURL=404.js.map