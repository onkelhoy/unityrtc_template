"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var peer_1 = require("./peer");
var socket_1 = require("./socket");
var Bridge = (function () {
    function Bridge() {
        var _this = this;
        this._onerror = function (_a) {
            var message = _a.message, error = _a.error;
            window.WEB.socketError(error, message);
        };
        this._farwell = function (_a) {
            var timestamp = _a.timestamp;
            window.UI.start(new Date(timestamp).toISOString());
            if (_this.socket)
                _this.terminateSocket();
        };
        this._hostChange = function (_a) {
            var host = _a.host;
            window.WEB.hostChange(host);
        };
        this._otherjoin = function (_a) {
            var id = _a.id;
            _this._fromPeer(id);
            _this.peers[id].createOffer(_this._socketsend, id);
        };
        this._offer = function (_a) {
            var from = _a.from, offer = _a.offer;
            _this._fromPeer(from);
            _this.peers[from].handleOffer(_this._socketsend, offer);
        };
        this._answer = function (_a) {
            var from = _a.from, answer = _a.answer;
            return _this.peers[from].handleAnswer(answer);
        };
        this._candidate = function (_a) {
            var from = _a.from, candidate = _a.candidate;
            _this._fromPeer(from);
            _this.peers[from].handleCandidate(candidate);
        };
        this._removePeer = function (id) {
            if (_this.peers[id])
                _this.peers[id].close();
            delete _this.peers[id];
        };
        this._fromPeer = function (id) {
            if (!_this.peers[id]) {
                _this.peers[id] = new peer_1.default(_this._socketsend, id, _this._removePeer);
                window.WEB.newPeer(id);
            }
        };
        var url = /http(.*)/.exec(window.location.href) || ["", "ERROR.url-split.error"];
        this.socket = new socket_1.default("ws" + url[1]);
        this.peers = {};
        this.socket.on(common_1.SocketTypes.Join, this._otherjoin);
        this.socket.on(common_1.SocketTypes.HostChange, this._hostChange);
        this.socket.on(common_1.SocketTypes.Offer, this._offer);
        this.socket.on(common_1.SocketTypes.Answer, this._answer);
        this.socket.on(common_1.SocketTypes.Candidate, this._candidate);
        this.socket.on(common_1.SocketTypes.Farwell, this._farwell);
        this.socket.on(common_1.SocketTypes.Error + "-" + common_1.SocketErrorType.Host, this._onerror);
        this.socket.on(common_1.SocketTypes.Error + "-" + common_1.SocketErrorType.Join, this._onerror);
        this.socket.on(common_1.SocketTypes.Error + "-" + common_1.SocketErrorType.Room, this._onerror);
        this._socketsend = this.socket.send.bind(this.socket);
    }
    Bridge.prototype.create = function (room, password) {
        this.socket.send({ type: common_1.SocketTypes.Create, room: room, password: password });
    };
    Bridge.prototype.connect = function (room, password) {
        this.socket.send({ type: common_1.SocketTypes.Join, room: room, password: password });
    };
    Bridge.prototype.terminateSocket = function () {
        if (this.socket)
            this.socket.close();
    };
    Bridge.prototype.systemSend = function (message) {
        for (var peer in this.peers) {
            this.peers[peer].systemSend(JSON.stringify(message));
        }
    };
    Bridge.prototype.start = function () {
        this.socket.send({ type: common_1.SocketTypes.Farwell, timestamp: new Date().getTime() });
    };
    Bridge.prototype.send = function (to, message, channels) {
        if (!this.peers[to])
            return false;
        this.peers[to].send(message, channels);
        return true;
    };
    Bridge.prototype.broadcast = function (message, channels) {
        for (var peer in this.peers) {
            this.peers[peer].send(message, channels);
        }
    };
    Bridge.prototype.disconnect = function () {
        this.terminateSocket();
        for (var id in this.peers) {
            this._removePeer(id);
        }
    };
    return Bridge;
}());
exports.default = Bridge;
