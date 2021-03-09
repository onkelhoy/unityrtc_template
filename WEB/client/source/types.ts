import { SocketMessage } from "./global.types";

export type SocketEvents = {
  [key:string]: Function[]
}

export type SendFunction = (message:SocketMessage) => void;
