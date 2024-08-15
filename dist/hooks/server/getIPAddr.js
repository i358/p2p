"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req) => {
    let ip = (req.headers['x-forwarded-for'] || "0,0").split(",")[0] || req.connection.remoteAddress;
    return ip;
};
//# sourceMappingURL=getIPAddr.js.map