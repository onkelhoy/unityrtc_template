"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var types_1 = require("../types");
var Peer = (function () {
    function Peer(send, remote, close) {
        var _this = this;
        var configuration = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
            ],
        };
        var pc = null;
        if (window.RTCPeerConnection) {
            pc = new RTCPeerConnection(configuration);
        }
        else {
            pc = new webkitRTCPeerConnection(configuration);
        }
        this.connection = pc;
        pc.onicecandidate = function (event) {
            if (event.candidate) {
                send({
                    type: common_1.SocketTypes.Candidate,
                    candidate: event.candidate,
                    to: _this.remote,
                    from: window.ID
                });
            }
        };
        pc.onicecandidateerror = function (error) {
            return window.WEB.error(types_1.ErrorType.ICE, _this.remote, error.errorText);
        };
        pc.onconnectionstatechange = this.ConnectionStateChange.bind(this);
        pc.ondatachannel = this.onDataChannel.bind(this);
        this.gameLoaded = false;
        this.remote = remote;
        this.channels = {};
        this.close = close;
        this.kill = this.kill.bind(this);
    }
    Peer.prototype.kill = function () {
        var _a;
        for (var label in this.channels) {
            if (((_a = this.channels[label].channel) === null || _a === void 0 ? void 0 : _a.close) instanceof Function)
                this.channels[label].channel.close();
        }
        this.connection.close();
        window.UNITY.disconnect(this.remote);
        this.close(this.remote);
    };
    Peer.prototype.ConnectionStateChange = function () {
        window.WEB.connectionUpdate(this.remote, this.connection.connectionState);
        switch (this.connection.connectionState) {
            case "closed":
            case "disconnected":
            case "failed":
                this.kill();
                break;
        }
    };
    Peer.prototype.onDataChannel = function (event) {
        var channel = event.channel;
        this.setUpChannel(channel);
    };
    Peer.prototype.setUpChannel = function (channel) {
        var _this = this;
        channel.onmessage = function (event) { return _this.onChannelMessage(channel.label, event); };
        channel.onerror = function (error) { return _this.onChannelError(channel.label, error); };
        channel.onopen = function () { return _this.onChannelOpen(channel.label); };
        channel.onclose = function () { return _this.onChannelClose(channel.label); };
        this.channels[channel.label] = {
            channel: channel,
            queue: [],
        };
    };
    Peer.prototype.createChannel = function (name) {
        var channel = this.connection.createDataChannel(name);
        this.setUpChannel(channel);
    };
    Peer.prototype.onChannelOpen = function (label) {
        if (this.channels[label].queue.length > 0) {
            for (var _i = 0, _a = this.channels[label].queue; _i < _a.length; _i++) {
                var message = _a[_i];
                this.send(message, label);
            }
            this.channels[label].queue = [];
        }
        window.WEB.channelUpdate(label, "connected");
    };
    Peer.prototype.onChannelClose = function (label) {
        window.WEB.channelUpdate(label, "closed");
    };
    Peer.prototype.onChannelMessage = function (name, event) {
        if (name !== window.PEER.system) {
            window.UNITY.message(name, this.remote, event.data);
        }
        else {
            window.PEER.systemPeerMessage(this.remote, event);
        }
    };
    Peer.prototype.onChannelError = function (name, event) {
        window.WEB.channelUpdate(name, "failed");
        window.WEB.error(types_1.ErrorType.Channel, name, event.error.message);
    };
    Peer.prototype.createOffer = function (send, from) {
        var _this = this;
        for (var _i = 0, _a = window.PEER.channels; _i < _a.length; _i++) {
            var c = _a[_i];
            this.createChannel(c);
        }
        this.createChannel(window.PEER.system);
        return this.connection
            .createOffer()
            .then(function (offer) {
            send({ type: common_1.SocketTypes.Offer, to: from, from: window.ID, offer: offer });
            _this.connection.setLocalDescription(offer);
        })
            .catch(function (error) {
            console.error("offer-error", error);
            alert("Error when creating an offer");
        });
    };
    Peer.prototype.handleOffer = function (send, desription) {
        var _this = this;
        this.connection.setRemoteDescription(new RTCSessionDescription(desription));
        return this.connection
            .createAnswer()
            .then(function (answer) {
            _this.connection.setLocalDescription(answer);
            send({ type: common_1.SocketTypes.Answer, answer: answer, to: _this.remote, from: window.ID });
        })
            .catch(function (error) {
            window.WEB.answerError(_this.remote, error);
        });
    };
    Peer.prototype.handleAnswer = function (desription) {
        this.connection.setRemoteDescription(new RTCSessionDescription(desription));
    };
    Peer.prototype.handleCandidate = function (candidate) {
        this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    };
    Peer.prototype.handleLeave = function () {
        this.connection.close();
        this.connection.onicecandidate = null;
        this.close();
    };
    Peer.prototype.systemSend = function (message) {
        if (this.channels[window.PEER.system].channel.readyState === "open") {
            this.channels[window.PEER.system].channel.send(message);
        }
        else {
            this.channels[window.PEER.system].queue.push(message);
        }
    };
    Peer.prototype.send = function (message, channels) {
        if (typeof channels === "string") {
            channels = [channels];
        }
        if (!channels) {
            channels = Object.keys(this.channels);
        }
        for (var _i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
            var label = channels_1[_i];
            if (label !== window.PEER.system)
                if (this.channels[label].channel.readyState === "open") {
                    this.channels[label].channel.send(message);
                }
                else {
                    this.channels[label].queue.push(message);
                }
        }
    };
    return Peer;
}());
exports.default = Peer;
