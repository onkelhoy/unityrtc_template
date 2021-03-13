import Bridge from './RTC/bridge';
import { UnityInstance } from './types';

// unityInstance = UnityLoader.instantiate("unityContainer", "Build/build.json", {onProgress: UnityProgress});

declare global {
  interface Window { 
    RTC: Bridge; 
    UNITY: {
      message: (channel:string, peer_id:string, msg:string) => void;
      error: (type:string, peer_id:string, error:string) => void;
      disconnect: (peer_id:string) => void;
      hostChange: (host:string) => void;
      start: (timestamp:string) => void;
    },
    WEB: {
      connectionUpdate: (id:string, state:RTCPeerConnectionState) => void;
      channelUpdate: (label:string, state:RTCPeerConnectionState) => void;
      setID: (id:string, room:string) => void;
      socketError: (type:string, message:string) => void;
      answerError: (peer_id:string, error:DOMException) => void;
      newPeer: (peer_id:string) => void;
    }
    unityInstance: UnityInstance; // this is assigned in template.html
    peerID:string;
  }
}

window.RTC = new Bridge();

function sendToUnity(method:string, message:string):void {
  if (window.unityInstance) {
    window.unityInstance.SendMessage("RTC", method, message);
  }
}

window.WEB = {
  socketError: (type, message) => {
    console.error(`socketError type: ${type}, message: ${message}`);
    // sendToUnity("socketError", message);
  },
  answerError: (peer_id, error) => {
    console.log(`Answer Error from : ${peer_id} - ${error.message}`);
    // sendToUnity("answerError", `${peer_id}#${error.message}`);
  },
  connectionUpdate: (id, state) => {
    console.log(`connectionUpdate id: ${id}, state: ${state}`);
    // sendToUnity("connectionUpdate", `${id}#${state}`);
  },
  channelUpdate: (label, state) => {
    console.log(`channelUpdate label: ${label} state: ${state}`);
    // sendToUnity("channelUpdate", `${label}#${state}`);
  },
  setID: (id, room) => {
    console.log(`Connected to Room ${room} with ID : ${id}`);
    // sendToUnity("setID", `${id}#${room}`);
  },
  newPeer: (peer_id) => {
    console.log(`Incomming peer connection : ${peer_id}`);
    // sendToUnity("newPeer", peer_id);
  },
}

window.UNITY = {
  message: (channel, peer_id, message) => {
    console.log(`message channel: ${channel} peer_id: ${peer_id}, message: ${message}`);
    sendToUnity("message", `${peer_id}#${channel}#${message}`);
  },
  error: (type, peer_id, error) => {
    console.log(`error type: ${type} peer_id: ${peer_id} error: ${error}`);
    sendToUnity("error", `${type}#${peer_id}#${error}`);
  },
  disconnect: (peer_id) => {
    console.log(`disconnected peer id: ${peer_id}`);
    sendToUnity("disconnect", peer_id);
  },
  hostChange: (host) => {
    console.log(`hostChange : ${host}`);
    sendToUnity("hostChange", host);
  },
  start: (timestamp) => {
    console.log(`Starting game ${timestamp}`);
    sendToUnity("start", `${timestamp}#${Object.keys(window.RTC.peers).join()}`);
  }
};