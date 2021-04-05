export enum SocketMessageType {
  Signal,
  Join,
  Leave,
  Heartbeat,
  HostChange,
  Connect,
  Farwell,
  Error,
}
export enum SignalType {
  Candidate,
  Answer,
  Offer,
}
export enum ErrorType {
  Connect,
  Password,
  Host,
}
export interface ISocketMessage {
  type:SocketMessageType;
}
export interface ISocketMessageError extends ISocketMessage {
  error:ErrorType;
}
export interface ITargetSocketMessage extends ISocketMessage {
  target:string;
}
export interface ISignalMessage extends ITargetSocketMessage {
  signal:SignalType;
  data:RTCIceCandidateInit|RTCSessionDescriptionInit
}
export interface IOfferMessage extends ISignalMessage {
  username:string;
}
export interface ISocketJoinMessage extends ISocketMessage {
  username:string;
  password?:string;
  room:string;
}
export interface ISocketConnectMessage extends ISocketMessage {
  room:string;
  host:string;
}
export interface ITargetJoinSocketMessage extends ITargetSocketMessage {
  username:string;
}