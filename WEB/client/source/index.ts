import Bridge from './RTC/bridge';
import { ErrorType, UnityInstance } from './types';

import './Menu';

// unityInstance = UnityLoader.instantiate("unityContainer", "Build/build.json", {onProgress: UnityProgress});

declare global {
  interface Window { 
    RTC: Bridge; 
    UNITY: {
      message: (channel:string, peer_id:string, msg:string) => void;
      disconnect: (peer_id:string) => void;
      start: (timestamp:string) => void;
    },
    WEB: {
      connectionUpdate: (id:string, state:RTCPeerConnectionState) => void;
      channelUpdate: (label:string, state:RTCPeerConnectionState) => void;
      setID: (id:string, room:string) => void;
      socketError: (type:string, message:string) => void;
      answerError: (peer_id:string, error:DOMException) => void;
      error: (type:ErrorType, peer_id:string, error:string) => void;
      hostChange: (host:string) => void;
      // newPeer: (peer_id:string) => void;
    },
    UI: {
      Create: () => void;
      Connect: () => void;
    },
    unityInstance: UnityInstance; // this is assigned in template.html
    ID:string;
    HOST:string;
    ROOM:string;
    Create:
  }
}

window.RTC = new Bridge();

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