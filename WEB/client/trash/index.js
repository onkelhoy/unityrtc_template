"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bridge_1 = require("./RTC/bridge");
var types_1 = require("./types");
require("./UI");
var common_1 = require("./common");
window.RTC = new bridge_1.default();
window.MODE = types_1.MODE.MENU;
window.PEER = {
    channels: ["default"],
    system: "system",
    loads: 0,
    gotAll: false,
    systemPeerMessage: function (peer_id, event) {
        var message = JSON.parse(event.data);
        console.log('SYSTEM MESSAGE', peer_id, message);
        switch (message.type) {
            case types_1.PeerSystemMessageType.GAME_LOADED: {
                if (window.RTC.peers[peer_id]) {
                    window.RTC.peers[peer_id].gameLoaded = true;
                }
                window.PEER.loads++;
                if (window.PEER.loads === Object.keys(window.RTC.peers).length && !window.PEER.gotAll) {
                    window.RTC.systemSend({ type: types_1.PeerSystemMessageType.ALL });
                }
                break;
            }
            case types_1.PeerSystemMessageType.ALL: {
                if (!window.PEER.gotAll) {
                    if (window.HOST === window.ID) {
                        var timestamp = new Date().toISOString();
                        window.RTC.systemSend({ type: types_1.PeerSystemMessageType.START, timestamp: timestamp });
                    }
                }
                window.PEER.gotAll = true;
            }
            case types_1.PeerSystemMessageType.START: {
                var timestamp = message.timestamp;
                window.UNITY.start(timestamp);
            }
        }
    },
};
var iterations = 0;
while (true) {
    if (!window.PEER.channels.find(function (s) { return s === window.PEER.system; })) {
        break;
    }
    iterations++;
    window.PEER.system = "system" + iterations;
}
var interval = window.setInterval(heartbeat, 1000);
function heartbeat() {
    if (window.MODE === types_1.MODE.MENU && window.RTC.socket.ws.readyState === window.RTC.socket.ws.OPEN) {
        window.RTC.socket.send({ type: common_1.SocketTypes.HeartBeat });
    }
    else {
        window.clearInterval(interval);
    }
}
function sendToUnity(method, message) {
    if (window.UNITY.instance) {
        window.UNITY.instance.SendMessage("WEB", method, message);
    }
}
window.UNITY = {
    message: function (channel, peer_id, message) {
        console.log("message channel: " + channel + "\u00A0peer_id: " + peer_id + ", message: " + message);
        sendToUnity("message", peer_id + "#" + channel + "#" + message);
    },
    disconnect: function (peer_id) {
        console.log("disconnected peer id: " + peer_id);
        sendToUnity("disconnect", peer_id);
    },
    start: function (timestamp) {
        console.log("Starting game " + timestamp);
        sendToUnity("start", "" + window.ID + window.ROOM + "#" + window.HOST + "#" + timestamp + "#" + Object.keys(window.RTC.peers).join());
    },
    instance: null,
    loaded: false,
    Loader: null,
};
