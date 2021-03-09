"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const utils_1 = require("../utils");
const global_types_1 = require("../global.types");
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
        case "offer":
            return offer(user, data);
        case "login":
            return login(user, data.credentials);
        case "answer":
            return answer(user, data);
        case "candidate":
            return candidate(user, data);
        case "leave":
            return leave(user);
        case "join":
            return join(user, data);
        case "create": {
            return create(user, data);
        }
    }
}
function roomCheck(user, cb) {
    const { room } = user;
    if (!!rooms[room])
        cb();
    else {
        utils_1.sendTo(user, {
            type: "error",
            error: "room",
            message: "Room is not existing",
            code: 4,
        });
    }
}
function join(user, message) {
    if (!message.token) {
        utils_1.sendTo(user, rooms[message.room].join(user, message.password));
    }
    if (rooms[message.room]) {
        utils_1.sendTo(user, rooms[message.room].join(user, message.password));
    }
    else {
        utils_1.sendTo(user, {
            type: "error",
            error: "room",
            message: "Room is not existing",
            code: 4,
        });
    }
}
function answer(user, message) {
    roomCheck(user, () => {
        const newMessage = Object.assign(Object.assign({}, message), { id: user.id });
        rooms[user.room].send(message.target, newMessage);
    });
}
function leave(user) {
    roomCheck(user, () => {
        rooms[user.room].leave(user);
    });
}
function login(user, data) {
    const { username, password } = data;
    if (username && password) {
        utils_1.sendTo(user, { type: "success", success: global_types_1.SocketSuccessType.Login, token: "Cake is a Lie" });
    }
    else {
        utils_1.sendTo(user, {
            type: "error",
            error: "login",
            message: "Wrong credentials",
            code: -1,
        });
    }
}
function offer(user, message) {
    roomCheck(user, () => {
        const newMessage = Object.assign(Object.assign({}, message), { id: user.id });
        rooms[user.room].send(message.target, newMessage);
    });
}
function candidate(user, message) {
    roomCheck(user, () => {
        const newMessage = Object.assign(Object.assign({}, message), { id: user.id });
        rooms[user.room].send(message.target, newMessage);
    });
}
function create(user, message) {
    if (rooms[message.room]) {
        // error
        utils_1.sendTo(user, {
            type: "error",
            error: "room",
            message: "This room already exists",
            code: 1,
        });
    }
    rooms[message.room] = new room_1.default(message.room, message.password);
    join(user, message);
    utils_1.sendTo(user, { type: "success", success: global_types_1.SocketSuccessType.RoomCreate, });
}
exports.default = wss;
//# sourceMappingURL=index.js.map