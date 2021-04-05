import { IWindow } from './types';
import { sendToUnity } from 'utils';


declare global {
  interface Window extends IWindow {}
};

window.UNITY = {
  instance: null,
  message: (channel, peer_id, message) => {
    console.log(`message channel: ${channel} peer_id: ${peer_id}, message: ${message}`);
    sendToUnity("message", `${peer_id}#${channel}#${message}`);
  },
  disconnect: (peer_id) => {
    console.log(`disconnected peer id: ${peer_id}`);
    sendToUnity("disconnect", peer_id);
  },
  start: (timestamp, id, room, host, peers) => {
    console.log(`Starting game ${timestamp}`);
    sendToUnity("start", `${id}${room}#${host}#${timestamp}#${peers.join()}`);
  }
};

export {};