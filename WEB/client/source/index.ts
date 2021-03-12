import Bridge from './bridge';
import { UnityInstance } from './types';

// unityInstance = UnityLoader.instantiate("unityContainer", "Build/build.json", {onProgress: UnityProgress});

declare global {
  interface Window { 
    RTC: Bridge; 
    UNITY: {
      connectionUpdate: (id:string, state:RTCPeerConnectionState) => void;
      channelUpdate: (label:string, state:RTCPeerConnectionState) => void;
      message: (channel:string, peer_id:string, msg:string) => void;
      error: (type:string, peer_id:string, error:string) => void;
      disconnect: (peer_id:string) => void;
      hostChange: (host:string) => void;
      setID: (id:string, room:string) => void;
      socketError: (type:string, message:string) => void;
      answerError: (error:DOMException) => void;
      newPeer: (id:string) => void;
    },
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

window.UNITY = {
  socketError: (type, message) => {
    console.error(`socketError type: ${type}, message: ${message}`);
    sendToUnity("socketError", message);
  },
  answerError: (error) => {
    console.log(`answerError : ${error.message}`);
    sendToUnity("answerError", error.message);
  },
  connectionUpdate: (id, state) => {
    console.log(`connectionUpdate id: ${id}, state: ${state}`);
    sendToUnity("connectionUpdate", `${id}#${state}`);
  },
  message: (channel, peer_id, message) => {
    console.log(`message channel: ${channel} peer_id: ${peer_id}, message: ${message}`);
    sendToUnity("message", `${peer_id}#${channel}#${message}`);
  },
  error: (type, peer_id, error) => {
    console.log(`error type: ${type} peer_id: ${peer_id} error: ${error}`);
    sendToUnity("error", `${type}#${peer_id}#${error}`);
  },
  channelUpdate: (label, state) => {
    console.log(`channelUpdate label: ${label} state: ${state}`);
    sendToUnity("channelUpdate", `${label}#${state}`);
  },
  disconnect: (peer_id) => {
    console.log(`disconnected peer id: ${peer_id}`);
    sendToUnity("disconnect", peer_id);
  },
  hostChange: (host) => {
    console.log(`hostChange : ${host}`);
    sendToUnity("hostChange", host);
  },
  setID: (id, room) => {
    console.log(`Connected to Room ${room} with ID : ${id}`);
    sendToUnity("setID", `${id}#${room}`);
  },
  newPeer: (id) => {
    console.log(`Incomming peer connection : ${id}`);
    sendToUnity("newPeer", id);
  } 
};