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
    MODE[MODE["MENU"] = 0] = "MENU";
    MODE[MODE["GAME"] = 1] = "GAME";
})(MODE = exports.MODE || (exports.MODE = {}));
var PeerSystemMessageType;
(function (PeerSystemMessageType) {
    PeerSystemMessageType[PeerSystemMessageType["GAME_LOADED"] = 0] = "GAME_LOADED";
    PeerSystemMessageType[PeerSystemMessageType["ALL"] = 1] = "ALL";
    PeerSystemMessageType[PeerSystemMessageType["START"] = 2] = "START";
})(PeerSystemMessageType = exports.PeerSystemMessageType || (exports.PeerSystemMessageType = {}));
