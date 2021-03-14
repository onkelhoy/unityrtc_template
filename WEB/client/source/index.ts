import Bridge from './RTC/bridge';
import { ErrorType, IUnityInstance, MODE, IUnityLoader, PeerSystemMessage, PeerSystemMessageType, PeerSystemTimestampMessage } from './types';

import './UI';
import { SocketErrorType, SocketTypes } from './common.types';

// unityInstance = UnityLoader.instantiate("unityContainer", "Build/build.json", {onProgress: UnityProgress});

declare global {
  interface Window { 
    RTC:Bridge; 
    UNITY: {
      message: (channel:string, peer_id:string, msg:string) => void;
      disconnect: (peer_id:string) => void;
      start: (timestamp:string) => void;
      buildpath:string; // this is assigned in template.html
      instance:IUnityInstance;
      loaded:boolean;
      loader:IUnityLoader;
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
      channels:[string];
      system:string;
      loads:number;
      gotAll:boolean;
      peerMessage: (peer_id:string, event:MessageEvent) => void;
    },
    UI: {
      Create: () => void;
      Connect: () => void;
      start: (timestamp:string) => void;
      disconnect: (peer_id:string) => void;
    },
    ID:string;
    HOST:string;
    ROOM:string;
    MODE:MODE;
  }
}

// window.unityInstance = UnityLoader.instantiate("unityContainer", window.UNITY.buildpath, {onProgress: UnityProgress});


window.RTC = new Bridge();
window.MODE = MODE.MENU;

window.PEER = {
  channels: ["default"],
  system: "system",
  loads: 0,
  gotAll: false,

  peerMessage: (peer_id, event) => {
    const message = JSON.parse(event.data) as PeerSystemMessage;
    
    switch (message.type) {
      case PeerSystemMessageType.GAME_LOADED: {
        if (window.RTC.peers[peer_id]) {
          window.RTC.peers[peer_id].gameLoaded = true;
        }
        window.PEER.loads++;

        if (window.PEER.loads === Object.keys(window.RTC.peers).length && window.PEER.gotAll) {
          window.RTC.systemSend({ type: PeerSystemMessageType.ALL })
        }
        break
      }
      case PeerSystemMessageType.ALL: {
        if (!window.PEER.gotAll) {
          // TODO start game
          if (window.HOST === window.ID) {
            const timestamp = new Date().toTimeString();

            window.RTC.systemSend({ type: PeerSystemMessageType.START, timestamp } as PeerSystemTimestampMessage);
            window.UNITY.start(timestamp);
          }
        }
        window.PEER.gotAll = true;
      }
      case PeerSystemMessageType.START: {
        const { timestamp } = message as PeerSystemTimestampMessage
        window.UNITY.start(timestamp);
      }
    }
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
  if (window.UNITY.instance) {
    window.UNITY.instance.SendMessage("RTC", method, message);
  }
}

window.UNITY.message = function(channel, peer_id, message) {
  console.log(`message channel: ${channel} peer_id: ${peer_id}, message: ${message}`);
  sendToUnity("message", `${peer_id}#${channel}#${message}`);
}

window.UNITY.disconnect = function(peer_id) {
  console.log(`disconnected peer id: ${peer_id}`);
  sendToUnity("disconnect", peer_id);
}

window.UNITY.start = function(timestamp) {
  console.log(`Starting game ${timestamp}`);
  sendToUnity("start", `${window.ID}${window.ROOM}#${window.HOST}#${timestamp}#${Object.keys(window.RTC.peers).join()}`);
}