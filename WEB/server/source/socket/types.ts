import WebSocket from 'ws';
import { SocketMessage } from 'common.types';

export interface ISocket extends WebSocket {
  room:string;
  id:string;
  heartbeat:number;
}

export interface IMessage extends SocketMessage  {
  message: string;
}