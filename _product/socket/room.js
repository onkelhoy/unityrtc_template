"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const common_types_1 = require("../common.types");
class Room {
    constructor(name, password = "") {
        this.name = name;
        this.password = password;
        this.users = {};
        this.count = 0;
        this.host = null;
    }
    join(user, password) {
        if (password !== this.password) {
            utils_1.sendTo(user, { type: common_types_1.SocketTypes.Error, error: common_types_1.SocketErrorType.Join, message: "incorrect password" });
        }
        // notify all
        const id = `${this.name}#${this.count}`;
        user.id = id;
        user.room = this.name;
        this.count++;
        if (!this.host) {
            this.host = id;
        }
        else
            this.broadcast(user, { type: common_types_1.SocketTypes.Join, id: user.id });
        this.users[id] = user;
        utils_1.sendTo(user, { type: common_types_1.SocketTypes.JoinAnswer, id, host: this.host });
    }
    leave(user) {
        this.users[user.id].close();
        delete this.users[user.id];
        // notify all in room
        this.count--;
        if (this.count > 0) {
            this.broadcast(user, { type: common_types_1.SocketTypes.Leave, id: user.id });
            this.host = Object.keys(this.users)[0];
        }
    }
    broadcast(sender, message) {
        const data = Object.assign(Object.assign({}, message), { id: sender === null || sender === void 0 ? void 0 : sender.id });
        for (const id in this.users) {
            if (sender && id === sender.id) {
                continue;
            }
            utils_1.sendTo(this.users[id], data);
        }
    }
    farwell(user) {
        if (user.id === this.host) {
            this.broadcast(null, { type: common_types_1.SocketTypes.Farwell });
            return true;
        }
        this.send(user.id, {
            type: common_types_1.SocketTypes.Error,
            message: "You are not host",
            error: common_types_1.SocketErrorType.Host,
            code: -1
        });
        return false;
    }
    send(id, message) {
        if (!this.users[id])
            return false;
        utils_1.sendTo(this.users[id], message);
        return true;
    }
}
;
exports.default = Room;
