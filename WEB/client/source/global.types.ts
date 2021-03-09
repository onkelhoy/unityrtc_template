export enum SocketSuccessType {
  RoomCreate = "room-create",
  Login = "login",
  Join = "join",
}

export interface SocketMessage {
  type:string;
};

export interface CredentialMessage extends SocketMessage {
  token?: string;
}


export interface InfoMessage extends CredentialMessage {
  message:string;
}

export interface ErrorSocketMessage extends InfoMessage {
  error:string;
};

export interface SuccessSocketMessage extends InfoMessage {
  success:SocketSuccessType;
};

export interface LoginAnswerMessage extends SuccessSocketMessage {
  token:string;
}

export interface SocketUserMessage extends CredentialMessage {
  target:string
};

export interface SocketAnswerMessage extends SocketUserMessage {
  answer:RTCSessionDescriptionInit
}

export interface SocketCandidateMessage extends SocketUserMessage {
  candidate:RTCIceCandidateInit
}

export interface JoinAnswerMessage extends SuccessSocketMessage {
  id:string;
}

export interface SocketLoginMessage extends SocketMessage {
  credentials: Credentials;
}

export interface SocketJoinMessage extends SocketUserMessage {
  password:string
  room:string
}
export interface SocketOfferMessage extends SocketUserMessage {
  offer: any
}

export interface SocketCreateMessage extends SocketUserMessage {
  room:string
  password?:string
}

export interface Credentials {
  username: string;
  password: string;
};