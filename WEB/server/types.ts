import WebSocket from 'ws';
import { SocketMessage } from 'common';

export interface Socket extends WebSocket {
  room:string;
  id:string;
  heartbeat:number;
}

export interface Message extends SocketMessage  {
  message: string;
}
