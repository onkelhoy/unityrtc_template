import WebSocket from 'ws';
import { SocketMessage } from '../common/types';

export interface Socket extends WebSocket {
  room:string;
  id:string;
}

export interface Message extends SocketMessage  {
  message: string;
}
