"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTo = void 0;
function sendTo(socket, message) {
    const strmessage = JSON.stringify(message);
    socket.send(strmessage);
}
exports.sendTo = sendTo;
;
//# sourceMappingURL=utils.js.map