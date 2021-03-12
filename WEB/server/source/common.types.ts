export enum SocketTypes {
  Create = "room",
  Connect = "connect",
  Join = "join",
  JoinAnswer = 'join-answer',
  HostChange = "host-change",
  Leave = "leave",
  Error = "error",
  Farwell = "farwell",

  Candidate = 'candidate',
  Offer = 'offer',
  Answer = 'answer'
}

export enum SocketErrorType {
  Room = "room",
  Join = "join",
  Host = 'host',
}

export interface SocketMessage {
  type:SocketTypes;
};

//#region request messages
// can add whatever to it now
export interface SocketRequestMessage extends SocketMessage {
  from:string|null
}

export interface SocketRequestCreate extends SocketMessage {
  room:string,
  password?:string
}

export interface SocketRequestJoin extends SocketRequestCreate {}

export interface SocketRequestLeave extends SocketRequestMessage {}


export interface SocketP2PRequest extends SocketRequestMessage {
  to:string;
}

export interface SocketRequestCandidate extends SocketP2PRequest {
  candidate:RTCIceCandidateInit
}

export interface SocketRequestOffer extends SocketP2PRequest {
  offer: RTCSessionDescriptionInit
}

export interface SocketRequestAnswer extends SocketP2PRequest {
  answer:RTCSessionDescriptionInit
}
//#endregion

//#region incoming messages
export interface SocketMessageJoin extends SocketMessage {
  id:string;
}

export interface SocketMessageHostChange extends SocketMessage {
  host:string;
}

export interface SocketMessageCreate extends SocketMessage {
  id:string;
}

export interface SocketMessageJoinAnswer extends SocketMessage {
  id:string;
  host:string;
  room:string;
}

export interface SocketMessageLeave extends SocketMessage {
  id:string;
}

export interface SocketMessageError extends SocketMessage {
  error:SocketErrorType;
  message:string;
}

export interface SocketMessageP2P extends SocketMessage {
  from: string;
}

export interface SocketMessageCandidate extends SocketMessageP2P {
  candidate:RTCIceCandidateInit
}

export interface SocketMessageOffer extends SocketMessageP2P {
  offer: RTCSessionDescriptionInit
}

export interface SocketMessageAnswer extends SocketMessageP2P {
  answer:RTCSessionDescriptionInit
}
//#endregion
