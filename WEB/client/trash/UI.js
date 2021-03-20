"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("common");
var types_1 = require("types");
window.UI = {
    Create: function () {
        var info = gatherInfo();
        console.log(info);
        window.RTC.create(info.room, info.password);
    },
    Connect: function () {
        var info = gatherInfo();
        window.RTC.connect(info.room, info.password);
    },
    start: function (timestamp) {
        window.MODE = types_1.MODE.GAME;
        document.querySelector("section.menu").classList.remove("active");
        document.querySelector("section.loading").classList.add("active");
        LoadUnity(timestamp);
    },
    disconnect: function (id) {
        console.log('remove', id);
        var target = document.querySelector("#peers > li#" + id.replace('#', '-'));
        if (target) {
            target.parentNode.removeChild(target);
        }
    },
};
window.WEB = {
    socketError: function (type, message) {
        console.error("socketError type: " + type + ", message: " + message);
        switch (type) {
            case common_1.SocketErrorType.Host:
                document.querySelector("#lobbyerror").innerHTML = message;
                break;
            case common_1.SocketErrorType.Join:
            case common_1.SocketErrorType.Room:
                document.querySelector("#mainerror").innerHTML = message;
                break;
        }
    },
    answerError: function (peer_id, error) {
        console.log("Answer Error from : " + peer_id + " - " + error.message);
        alert("Problems With RTC answer");
    },
    connectionUpdate: function (id, state) {
        console.log("connectionUpdate id: " + id + ", state: " + state);
    },
    channelUpdate: function (label, state) {
        console.log("channelUpdate label: " + label + "\u00A0state: " + state);
    },
    setID: function (id, room) {
        console.log("Connected to Room " + room + " with ID : " + id);
        window.ID = id;
        window.ROOM = room;
        document.querySelector("section.menu > div.main").classList.toggle("active");
        document.querySelector("section.menu > div.lobby").classList.toggle("active");
        document.querySelector("#roomName").innerHTML = room;
        document.querySelector("#peers > li.you").innerHTML = id;
    },
    newPeer: function (peer_id) {
        console.log("Incomming peer connection : " + peer_id);
        var li = document.createElement("li");
        li.setAttribute("id", peer_id.replace('#', '-'));
        li.innerText = peer_id;
        document.querySelector("#peers").appendChild(li);
    },
    error: function (type, peer_id, error) {
        console.log("error type: " + type + "\u00A0peer_id: " + peer_id + " error: " + error);
    },
    hostChange: function (host) {
        console.log("hostChange : " + host);
        window.HOST = host;
        document.querySelector("#start").disabled = window.ID !== window.HOST;
    },
};
function gatherInfo() {
    var room = document.querySelector("#room").value;
    var password = document.querySelector("#password").nodeValue;
    return { room: room, password: password };
}
function LoadUnity(timestamp) {
    if (!window.UNITY.loaded) {
        window.UNITY.loaded = true;
        console.log(timestamp);
        var script = document.createElement("script");
        script.src = '/game/desktop/UnityLoader.js';
        script.onload = function () {
            console.log("loader", window.UNITY.Loader);
        };
        document.head.appendChild(script);
    }
}
function onProgress(unityInstance, progress) {
    console.log('unityInstance', unityInstance, 'progress', progress);
}
