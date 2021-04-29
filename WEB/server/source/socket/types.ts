import WebSocket from "ws";
import { ISocketMessage } from "types.global";

export interface ISocket extends WebSocket {
  room: string;
  id: string;
  heartbeat: number;
}

export interface IMessage extends ISocketMessage {
  message: string;
}
