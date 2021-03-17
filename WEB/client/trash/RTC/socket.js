"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("common");
var Socket = (function () {
    function Socket(url) {
        this.events = {};
        this.ws = new WebSocket(url);
        this.ws.onmessage = this.message.bind(this);
    }
    Socket.prototype.on = function (event, callback) {
        if (!this.events[event])
            this.events[event] = new Array();
        this.events[event].push(callback);
    };
    Socket.prototype.fire = function (event) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this.events[event])
            this.events[event].forEach(function (cb) { return cb.apply(void 0, params); });
    };
    Socket.prototype.send = function (data) {
        var msg = JSON.stringify(data);
        this.ws.send(msg);
    };
    Socket.prototype.close = function () {
        this.send({ type: common_1.SocketTypes.Leave });
        if (this.ws)
            this.ws.close();
    };
    Socket.prototype.error = function (e) {
        this.fire(common_1.SocketTypes.Error + "-" + e.error, e);
    };
    Socket.prototype.message = function (msg) {
        var data = JSON.parse(msg.data);
        if (this.events[data.type]) {
            this.fire(data.type, data);
        }
        switch (data.type) {
            case common_1.SocketTypes.Error:
                return this.error(data);
            case common_1.SocketTypes.Leave: {
                var id = data.id;
                window.UI.disconnect(id);
                break;
            }
            case common_1.SocketTypes.JoinAnswer: {
                var _a = data, id = _a.id, host = _a.host, room = _a.room;
                window.ID = id;
                window.WEB.hostChange(host);
                window.WEB.setID(id, room);
                break;
            }
            default:
                break;
        }
    };
    return Socket;
}());
exports.default = Socket;
