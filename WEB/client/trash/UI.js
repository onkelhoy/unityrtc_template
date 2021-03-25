"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var types_1 = require("./types");
window.UI = {
    Create: function () {
        var info = gatherInfo();
        window.RTC.create(info.room, info.password);
    },
    Connect: function () {
        var info = gatherInfo();
        window.RTC.connect(info.room, info.password);
    },
    start: function (timestamp) {
        window.MODE = types_1.MODE.GAME;
        setActive('loading');
        LoadUnity(timestamp);
    },
    disconnect: function (id) {
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
function setActive(name) {
    console.log('setting active', name);
    var current = document.querySelector('section.active');
    if (current) {
        console.log('found current', current.classList);
        current.classList.remove('active');
    }
    var target = document.querySelector("section." + name);
    target.classList.add('active');
}
function LoadUnity(timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var response, name_1, script;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!window.UNITY.loaded) return [3, 3];
                    window.UNITY.loaded = true;
                    console.log(timestamp);
                    return [4, fetch('/set-unity-preference', {
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                width: window.innerWidth,
                                height: window.innerHeight,
                                pixelRatio: window.devicePixelRatio,
                                id: window.ID,
                                room: window.ROOM,
                            })
                        })];
                case 1:
                    response = _a.sent();
                    return [4, response.json()];
                case 2:
                    name_1 = (_a.sent()).name;
                    console.log('version', name_1);
                    script = document.createElement("script");
                    script.src = '/Build/UnityLoader.js';
                    script.onload = function () {
                        setActive('game');
                        window.UNITY.instance = window.UNITY.Loader.instantiate("unityContainer", "Build/" + name_1 + ".json", { onProgress: onProgress });
                    };
                    document.head.appendChild(script);
                    _a.label = 3;
                case 3: return [2];
            }
        });
    });
}
function onProgress(unityInstance, progress) {
    if (progress >= 1) {
        console.log('UNITY IS NOW LOADED');
        unityInstance.SetFullscreen();
        window.RTC.systemSend({ type: types_1.PeerSystemMessageType.GAME_LOADED });
    }
}
window.onload = function () {
    setActive('menu');
};
