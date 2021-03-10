import { SocketMessage } from "./common.types";

export type SocketEvents = {
  [key:string]: Function[]
}

export type SendFunction = (message:SocketMessage) => void;
