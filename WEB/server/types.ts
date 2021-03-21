import WebSocket from 'ws';
import { SocketMessage } from './common';

export interface Socket extends WebSocket {
  room:string;
  id:string;
  heartbeat:number;
}

export interface Message extends SocketMessage  {
  message: string;
}

export interface CacheData {}

export interface RoomCache extends CacheData {
  room:string;
  password:string;
  peers:string[];
  host:string;
}

export interface ClientCache extends CacheData {
  id:string;
  game_path:string;
}