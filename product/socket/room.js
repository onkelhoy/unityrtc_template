"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const global_types_1 = require("../global.types");
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
            return { type: "error", error: "password", message: "incorrect password", code: 2 };
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
            this.broadcast(user, { type: "join" });
        this.users[id] = user;
        return { type: "success", success: global_types_1.SocketSuccessType.Join, id, };
    }
    leave(user) {
        delete this.users[user.id];
        // notify all in room
        this.count--;
        if (this.count > 0) {
            this.broadcast(user, { type: "leave" });
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
            this.broadcast(null, { type: "farwell" });
        }
        else
            this.send(user.id, { type: "error", message: "You are not host", error: "unothorized", code: -1 });
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
//# sourceMappingURL=room.js.map