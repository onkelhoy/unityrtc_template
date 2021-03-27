export enum SocketMessageType {
  Signal,
  Join,
  Leave,
  Heartbeat,

}
export enum SignalType {
  Candidate,
  Answer,
  Offer,
}
export interface ISocketMessage {
  type:SocketMessageType;
}
export interface ITargetSocketMessage extends ISocketMessage {
  target:string;
}
export interface ISignalMessage extends ITargetSocketMessage {
  stype:SignalType;
}
export interface ICandidateMessage extends ISignalMessage {
  candidate:RTCIceCandidateInit;
}
export interface IAnswerMessage extends ISignalMessage {
  answer:RTCSessionDescriptionInit;
}
export interface IOfferMessage extends ISignalMessage {
  offer:RTCSessionDescriptionInit;
}
