"use strict";
module.exports = {
    on: "typing",
    execute(io, socket, data) {
        io.emit("typing", data);
    },
};
//# sourceMappingURL=onTyping.js.map