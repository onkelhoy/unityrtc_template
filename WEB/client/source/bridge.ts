import { 
  SocketMessageAnswer,
  SocketMessageCandidate,
  SocketMessageOffer,
  SocketMessageJoin,
  SocketMessageHostChange,

  SocketRequestCreate,
  SocketRequestJoin,
  SocketTypes,
} from './common.types';
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

    this.socket.on(SocketTypes.Join, this._otherjoin);
    this.socket.on(SocketTypes.HostChange, this._hostChange);
    this.socket.on(SocketTypes.Offer, this._offer);
    this.socket.on(SocketTypes.Answer, this._answer);
    this.socket.on(SocketTypes.Candidate, this._candidate);

    this._socketsend = this.socket.send.bind(this.socket);
  }

  _hostChange = ({ host } : SocketMessageHostChange) => {
    window.host = host;
    window.UNITY.hostChange(host);
  }
  _otherjoin = ({ id } : SocketMessageJoin) => {
    if (!this.peers[id])
      this.peers[id] = new Peer(this._socketsend, id, this.Leave);
    this.peers[id].createOffer(this._socketsend, this.id as string);
  }
  _offer = ({ from, offer } : SocketMessageOffer) => {
    if (!this.peers[from])
      this.peers[from] = new Peer(this._socketsend, from, this.Leave);
    this.peers[from].handleOffer(this._socketsend, offer);
  }
  _answer = ({ from, answer } : SocketMessageAnswer) => this.peers[from].handleAnswer(answer);
  _candidate = ({ from, candidate } : SocketMessageCandidate) => this.peers[from].handleCandidate(candidate);


  Send(to:string, message:string, channels:string|string[]) {
    if (!this.peers[to]) return false;

    this.peers[to].send(message, channels);
    return true;
  }
  Broadcast(message:string, channels:string|string[]) {
    for (const peer in this.peers) {
      this.peers[peer].send(message, channels);
    }
  }
  Leave = (target:string) => {
    delete this.peers[target];
  }
  
  Create(room:string, password:string) {
    this.socket.send({ type: SocketTypes.Create, room, password } as SocketRequestCreate);
  }

  Connect(room:string, password:string) {
    this.socket.send({ type: SocketTypes.Join, room, password } as SocketRequestJoin);
  }

  Start() {
    this.socket.send({ type: SocketTypes.Farwell });
  }
}

export default Bridge;