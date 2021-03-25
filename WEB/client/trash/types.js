"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerSystemMessageType = exports.MODE = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["ICE"] = "ice";
    ErrorType["Channel"] = "channel";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
var MODE;
(function (MODE) {
    MODE[MODE["MENU"] = 1] = "MENU";
    MODE[MODE["GAME"] = 2] = "GAME";
})(MODE = exports.MODE || (exports.MODE = {}));
var PeerSystemMessageType;
(function (PeerSystemMessageType) {
    PeerSystemMessageType[PeerSystemMessageType["GAME_LOADED"] = 1] = "GAME_LOADED";
    PeerSystemMessageType[PeerSystemMessageType["ALL"] = 2] = "ALL";
    PeerSystemMessageType[PeerSystemMessageType["START"] = 3] = "START";
    PeerSystemMessageType[PeerSystemMessageType["CONNECTION_INIT"] = 4] = "CONNECTION_INIT";
})(PeerSystemMessageType = exports.PeerSystemMessageType || (exports.PeerSystemMessageType = {}));
