import {
  ISignalMessage,
  ISocketMessage,
  ITargetSocketMessage,
} from 'types';

export interface IPeerUtils {
  Signal:(message:ISignalMessage) => void;
  Join:(message:ITargetSocketMessage) => void;
  Leave:(message:ITargetSocketMessage) => void;
}

export type TSocketSendF = (message:ISocketMessage) => void;

export enum PeerMessageType {
  loaded,
  all,
  disconnect,
}

export interface IPeerMessage {
  type: PeerMessageType
  timestamp:number;
}

export interface IContext {
  Send: () => void;
}