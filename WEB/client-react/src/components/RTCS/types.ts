import {
  ISignalMessage,
  ISocketMessage,
  ITargetSocketMessage,
} from 'types.global';

export interface IPeerUtils {
  Signal:(message:ISignalMessage) => void;
  Join:(message:ITargetSocketMessage) => void;
  Leave:(message:ITargetSocketMessage) => void;
  Host:(message:ITargetSocketMessage) => void;
}

export type TSocketSendF = (message:ISocketMessage) => void;

export enum PeerMessageType {
  loaded,
  all,
  disconnect,
  start,
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

export enum PeerStatus {
  signaling,
  open,
  closed,
};

export enum SetType {
  room = 'ROOM',
  id = 'ID',
  host = 'HOST',
  username = 'USERNAME',
};

export interface IContext {
  peers: IPeer[],
  username:string,
  host:string,
  id:string,

  Disconnect:() => void;
  SystemBroadcast:(message:IPeerMessage) => void;
  Broadcast:(message:string, channels?:string|string[]) => Boolean;
  Send:(target:string, message:string, channels?:string|string[]) => Boolean;
  Join:(room: string, username: string, password?: string) => void;
};

export interface IChannelMessage {
  message:string;
  tries:number;
};

export interface IChannel {
  stream?:RTCDataChannel;
  queue:IChannelMessage[];
  name:string;
  tries:number;

  close:() => void;
  Send:(message:string) => Boolean;
  Awake:(peer:IPeer) => void;
  Init:(channel:RTCDataChannel, peer:IPeer) => void;
};

export type TChannels = {[key:string]: IChannel};
export interface IPeer {
  channels:TChannels;
  connection:RTCPeerConnection;
  id:string;
  username:string;
  status:PeerStatus;
  
  SystemSend:(message:string)=>void;
  onSystemMessage:(id:string, event:MessageEvent) => void;
  ondatachannelmessage:(name:string, event:MessageEvent) => void;
  signal:(message?: ISignalMessage) => Promise<void>;
  disconnect:() => void;
  ondatachannelclose:(name:string) => void;
  Send:(message:string, channels?:string|string[]) => Boolean;
};

export type Tpeers = {[key:string]: IPeer};

export interface ISocket {
  ws:WebSocket;
  peerUtils: IPeerUtils;
  id:string;
};