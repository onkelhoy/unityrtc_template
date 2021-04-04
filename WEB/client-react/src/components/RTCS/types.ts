import {
  ISignalMessage,
  ISocketMessage,
  ITargetSocketMessage,
} from 'types.global';

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
};

export interface IPeerMessage {
  type: PeerMessageType;
};

export enum SocketReadyState {
  connecting,
  open,
  closing,
  closed,
};

export enum SetType {
  room = 'ROOM',
  id = 'ID',
  host = 'HOST',
  username = 'USERNAME',
};

export interface IContext {
  Send: () => void;
  Leave: () => void;
  Broadcast: () => void;
  Join: (room: string, username: string, password?: string) => void;
  Set: (type:SetType, value:string) => void;
};

export interface IChannelMessage {
  message:string;
  tries:number;
};

export interface IChannel {
  stream?:RTCDataChannel;
  queue:IChannelMessage[];
  Send:(message:string) => Boolean;
  close:() => void;
  Awake:(connection:webkitRTCPeerConnection) => void;
  Init:(channel:RTCDataChannel, connection:webkitRTCPeerConnection) => void;
};

export type TChannels = {[key:string]: IChannel};
export interface IPeer {
  channels:TChannels;
  connection:RTCPeerConnection;
  id:string;
  username:string;
  signal:(message?: ISignalMessage) => Promise<void>;
  disconnect: () => void;
  Send: (message:string, channels?:string|string[]) => Boolean;
};

export type Tpeers = {[key:string]: IPeer};

export interface ISocket {
  ws:WebSocket;
  peerUtils: IPeerUtils;
  id:string;
};