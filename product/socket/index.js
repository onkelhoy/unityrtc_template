"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const utils_1 = require("../utils");
const common_types_1 = require("../common.types");
const room_1 = __importDefault(require("./room"));
const rooms = {};
const wss = new ws_1.default.Server({ noServer: true });
wss.on("connection", function (user) {
    user.on("message", onMessage.bind(user)); // binding just so ts can shutup..
});
function onMessage(message) {
    const data = JSON.parse(message);
    const user = this;
    switch (data.type) {
        case common_types_1.SocketTypes.Offer:
            return offer(user, data);
        case common_types_1.SocketTypes.Answer:
            return answer(user, data);
        case common_types_1.SocketTypes.Candidate:
            return candidate(user, data);
        case common_types_1.SocketTypes.Leave:
            return leave(user);
        case common_types_1.SocketTypes.Join:
            return join(user, data);
        case common_types_1.SocketTypes.Create:
            return create(user, data);
        case common_types_1.SocketTypes.Farwell:
            return farwell(user);
    }
}
function roomCheck(user, cb) {
    const { room } = user;
    if (!!rooms[room])
        cb();
    else {
        utils_1.sendTo(user, {
            type: common_types_1.SocketTypes.Error,
            error: common_types_1.SocketErrorType.Room,
            message: "Room is not existing",
        });
    }
}
function farwell(user) {
    roomCheck(user, () => {
        rooms[user.room].farwell(user);
    });
}
function join(user, message) {
    if (rooms[message.room]) {
        rooms[message.room].join(user, message.password);
    }
    else {
        utils_1.sendTo(user, {
            type: common_types_1.SocketTypes.Error,
            error: common_types_1.SocketErrorType.Room,
            message: "Room is not existing",
        });
    }
}
function answer(user, message) {
    roomCheck(user, () => {
        const newMessage = { type: common_types_1.SocketTypes.Answer, from: message.from, answer: message.answer };
        rooms[user.room].send(message.to, newMessage);
    });
}
function leave(user) {
    roomCheck(user, () => {
        rooms[user.room].leave(user);
    });
}
function offer(user, message) {
    roomCheck(user, () => {
        const newMessage = { type: common_types_1.SocketTypes.Offer, from: message.from, offer: message.offer };
        rooms[user.room].send(message.to, newMessage);
    });
}
function candidate(user, message) {
    roomCheck(user, () => {
        const newMessage = { type: common_types_1.SocketTypes.Candidate, from: message.from, candidate: message.candidate };
        rooms[user.room].send(message.to, newMessage);
    });
}
function create(user, message) {
    if (rooms[message.room]) {
        // error
        utils_1.sendTo(user, {
            type: common_types_1.SocketTypes.Error,
            error: common_types_1.SocketErrorType.Room,
            message: "This room already exists",
        });
    }
    rooms[message.room] = new room_1.default(message.room, message.password);
    join(user, message);
}
exports.default = wss;
//# sourceMappingURL=index.js.map