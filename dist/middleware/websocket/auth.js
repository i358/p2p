"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const userCheck_1 = __importDefault(require("@hooks/api/userCheck"));
function default_1(socket, next) {
    const auth = socket.handshake.auth;
    if (!auth.token)
        next(new Error("Unauthorized"));
    else {
        let token = auth.token.split(" ")[1];
        (0, userCheck_1.default)(token)
            .then((user) => {
            if (user.id && user.username) {
                socket.token = token;
                socket.user = user;
                next();
            }
            else
                next(new Error("User not found."));
        })
            .catch((err) => {
            next(new Error(err));
        });
    }
}
//# sourceMappingURL=auth.js.map