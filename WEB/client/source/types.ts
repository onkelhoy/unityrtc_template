import { SocketMessage } from "./common.types";

export type SocketEvents = {
  [key:string]: Function[]
}

export type SendFunction = (message:SocketMessage) => void;

export interface UnityInstance {
  SendMessage: (GameObject:string, Method:string, Message:string) => void;
}

export enum ErrorType {
  ICE = "ice",
  Channel = "channel",
}