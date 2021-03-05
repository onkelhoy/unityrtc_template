import WebSocket from 'ws';
import { SocketMessage } from 'unityrtc-types';

export interface Socket extends WebSocket {
  room:string;
  id:string;
}

export interface Message extends SocketMessage  {
  message: string;
}
