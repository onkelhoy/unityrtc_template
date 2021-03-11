"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTo = void 0;
const common_types_1 = require("./common.types");
function sendTo(socket, message) {
    const strmessage = JSON.stringify(message);
    socket.send(strmessage);
    if (message.type === common_types_1.SocketTypes.Farwell) {
        socket.close();
    }
}
exports.sendTo = sendTo;
;
