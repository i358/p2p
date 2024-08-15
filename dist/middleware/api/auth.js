"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(req, res, next) {
    let { authorization } = req.headers;
    if (!authorization)
        res.json({
            error: "Access Denied. Not authenticated, token might be invalid or missing.",
            status: {
                code: 403,
                message: "UNAUTHORIZED",
            },
        });
    else
        next();
}
//# sourceMappingURL=auth.js.map