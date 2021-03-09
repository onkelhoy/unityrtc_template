import { 
  SocketAnswerMessage,
  SocketCandidateMessage,
  SocketOfferMessage,
  SocketCreateMessage,
  SocketLoginMessage,
  JoinAnswerMessage,
  SocketJoinMessage,
  SocketSuccessType,
} from './global.types';
import { SendFunction } from './types';

import Peer from './peer';
import Socket from './socket';

class Bridge {
  socket:Socket;
  id:string|null;
  peers: {[key:string]:Peer};
  _socketsend:SendFunction;

  constructor() {
    const url = /http(.*)/.exec(window.location.href) || ["", "ERROR.url-split.error"];
    this.socket = new Socket(`ws${url[1]}`);
    this.peers = {};
    this.id = null;

    this.socket.on("join", this._join.bind(this));
    this.socket.on('success', this._success.bind(this));
    this.socket.on("offer", this._offer.bind(this));

    this.socket.on("answer", ({ target, answer } : SocketAnswerMessage) =>
      this.peers[target].handleAnswer(answer)
    );
    this.socket.on("candidate", ({ target, candidate } : SocketCandidateMessage) =>
      this.peers[target].handleCandidate(candidate)
    );

    this._socketsend = this.socket.send.bind(this.socket);
  }

  _join({ target } : SocketAnswerMessage) {
    if (!this.peers[target])
      this.peers[target] = new Peer(this._socketsend, target, this.leave.bind(this));
    this.peers[target].createOffer(this._socketsend, this.id as string);
  }
  _offer({ target, offer } : SocketOfferMessage) {
    if (!this.peers[target])
      this.peers[target] = new Peer(this._socketsend, target, this.leave.bind(this));
    this.peers[target].handleOffer(this._socketsend, offer);
  }
  _success(message : JoinAnswerMessage):void {
    switch(message.success) {
      case SocketSuccessType.Join: {
        this.id = message.id;
        break;
      }
    }
  }

  send(to:string, message:string, channels:string|string[]) {
    if (!this.peers[to]) return false;

    this.peers[to].send(message, channels);
    return true;
  }
  broadcast(message:string, channels:string|string[]) {
    for (const peer in this.peers) {
      this.peers[peer].send(message, channels);
    }
  }



  leave(target:string) {
    delete this.peers[target];
  }

  login(username:string, password:string) {
    this.socket.send({ type: "login", credentials: { username, password } } as SocketLoginMessage);
  }
  
  create(room:string, password:string) {
    this.socket.send({ type: "create", room, password } as SocketCreateMessage);
  }

  connect(room:string, password:string) {
    this.socket.send({ type: "join", room, password } as SocketJoinMessage);
  }
}

export default Bridge;