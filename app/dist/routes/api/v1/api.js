"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xml_1 = __importDefault(require("xml"));
const users_1 = __importDefault(require("./routeHandlers/users"));
const messages_1 = __importDefault(require("./routeHandlers/messages"));
const attachments_1 = __importDefault(require("./routeHandlers/attachments"));
const session_1 = __importDefault(require("./routeHandlers/session"));
const router = (0, express_1.Router)();
router.get("*", (req, res) => {
    res.type("application/xml");
    res.status(403);
    let XMLError = {
        APIResponse: [
            {
                Method: req.method,
            },
            {
                Status: res.statusCode,
            },
            {
                Content: "Unauthorized. Use the POST method.",
            },
        ],
    };
    res.send((0, xml_1.default)(XMLError, { declaration: true }));
});
router.use("/users", users_1.default);
router.use("/messages", messages_1.default);
router.use("/attachments", attachments_1.default);
router.use("/session", session_1.default);
exports.default = router;
//# sourceMappingURL=api.js.map