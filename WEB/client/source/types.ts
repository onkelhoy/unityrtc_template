import { SocketMessage } from "./common.types";

export type SocketEvents = {
  [key:string]: Function[]
}

export type SendFunction = (message:SocketMessage) => void;


export enum ErrorType {
  ICE = "ice",
  Channel = "channel",
}

export enum MODE {
  MENU,
  GAME,
}

export interface IUnityInstance {
  SendMessage: (GameObject:string, Method:string, Message:string) => void;
  Module: { 
    splashScreenStyle: string 
  }
  url:string;
  onProgress: UnityOnProgress;
  SetFullscreen:Function;
}

export type UnityOnProgress = (unityInstance: IUnityInstance, progress: number) => void;

export interface IUnityLoader {
  instantiate: (container:string, url:string, parameters:{ onProgress:UnityOnProgress }) => IUnityInstance;
}

export enum PeerSystemMessageType {
  GAME_LOADED,
  ALL,
  START,
}
export interface PeerSystemMessage {
  type:PeerSystemMessageType;
}

export interface PeerSystemTimestampMessage extends PeerSystemMessage {
  timestamp:string;
}