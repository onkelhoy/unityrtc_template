"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketErrorType = exports.SocketTypes = void 0;
var SocketTypes;
(function (SocketTypes) {
    SocketTypes["HeartBeat"] = "heartbeat";
    SocketTypes["Create"] = "room";
    SocketTypes["Connect"] = "connect";
    SocketTypes["Join"] = "join";
    SocketTypes["JoinAnswer"] = "join-answer";
    SocketTypes["HostChange"] = "host-change";
    SocketTypes["Leave"] = "leave";
    SocketTypes["Error"] = "error";
    SocketTypes["Farwell"] = "farwell";
    SocketTypes["Candidate"] = "candidate";
    SocketTypes["Offer"] = "offer";
    SocketTypes["Answer"] = "answer";
})(SocketTypes = exports.SocketTypes || (exports.SocketTypes = {}));
var SocketErrorType;
(function (SocketErrorType) {
    SocketErrorType["Room"] = "room";
    SocketErrorType["Join"] = "join";
    SocketErrorType["Host"] = "host";
})(SocketErrorType = exports.SocketErrorType || (exports.SocketErrorType = {}));
;
