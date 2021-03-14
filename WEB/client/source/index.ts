import Bridge from './RTC/bridge';
import { ErrorType, UnityInstance, MODE } from './types';

import './Menu';
import { SocketErrorType, SocketTypes } from './common.types';

// unityInstance = UnityLoader.instantiate("unityContainer", "Build/build.json", {onProgress: UnityProgress});

declare global {
  interface Window { 
    RTC:Bridge; 
    LoadingTime:number;
    UNITY: {
      message: (channel:string, peer_id:string, msg:string) => void;
      disconnect: (peer_id:string) => void;
      start: (timestamp:string) => void;
    },
    WEB: {
      connectionUpdate: (id:string, state:RTCPeerConnectionState) => void;
      channelUpdate: (label:string, state:RTCPeerConnectionState) => void;
      setID: (id:string, room:string) => void;
      socketError: (type:SocketErrorType, message:string) => void;
      answerError: (peer_id:string, error:DOMException) => void;
      error: (type:ErrorType, peer_id:string, error:string) => void;
      hostChange: (host:string) => void;
      newPeer: (peer_id:string) => void;
    },
    PEER: {
      channels: [string];
      system:string;
      peerMessage: (peer_id:string, event:MessageEvent) => void;
    },
    UI: {
      Create: () => void;
      Connect: () => void;
      start: (timestamp:string) => void;
      disconnect: (peer_id:string) => void;
    },
    unityInstance:UnityInstance; // this is assigned in template.html
    ID:string;
    HOST:string;
    ROOM:string;
    MODE:MODE
  }
}

window.RTC = new Bridge();
window.MODE = MODE.MENU;

window.PEER = {
  channels: ["default"],
  system: "system",
  peerMessage: (peer_id, event) => {
    alert(event.data); //FIXME remove me
  },
}

let iterations = 0;
while (true) {
  if (!window.PEER.channels.find(s => s === window.PEER.system)) {
    break;
  }
  iterations++;
  window.PEER.system = `system${iterations}`;
}

const interval = window.setInterval(heartbeat, 1000);
function heartbeat () {
  if (window.MODE === MODE.MENU && window.RTC.socket.ws.readyState === window.RTC.socket.ws.OPEN) {
    window.RTC.socket.send({ type: SocketTypes.HeartBeat });
  }
  else {
    window.clearInterval(interval);
  }
}

function sendToUnity(method:string, message:string):void {
  if (window.unityInstance) {
    window.unityInstance.SendMessage("RTC", method, message);
  }
}

window.UNITY = {
  message: (channel, peer_id, message) => {
    console.log(`message channel: ${channel} peer_id: ${peer_id}, message: ${message}`);
    sendToUnity("message", `${peer_id}#${channel}#${message}`);
  },
  disconnect: (peer_id) => {
    console.log(`disconnected peer id: ${peer_id}`);
    sendToUnity("disconnect", peer_id);
  },
  start: (timestamp) => {
    console.log(`Starting game ${timestamp}`);
    sendToUnity("start", `${window.ID}${window.ROOM}#${window.HOST}#${timestamp}#${Object.keys(window.RTC.peers).join()}`);
  }
};