import { 
  SocketMessageAnswer,
  SocketMessageCandidate,
  SocketMessageOffer,
  SocketMessageJoin,
  SocketMessageHostChange,

  SocketRequestCreate,
  SocketRequestJoin,
  SocketTypes,
  SocketErrorType,
  SocketMessageError,
} from 'common';
import { PeerSystemMessage, SendFunction } from 'client/types';

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

    // Socket also has some basic but this is a easy way to make new hooks
    this.socket.on(SocketTypes.Join, this._otherjoin);
    this.socket.on(SocketTypes.HostChange, this._hostChange);
    this.socket.on(SocketTypes.Offer, this._offer);
    this.socket.on(SocketTypes.Answer, this._answer);
    this.socket.on(SocketTypes.Candidate, this._candidate);
    this.socket.on(SocketTypes.Farwell, this._farwell);
    this.socket.on(`${SocketTypes.Error}-${SocketErrorType.Host}`, this._onerror);
    this.socket.on(`${SocketTypes.Error}-${SocketErrorType.Join}`, this._onerror);
    this.socket.on(`${SocketTypes.Error}-${SocketErrorType.Room}`, this._onerror);

    this._socketsend = this.socket.send.bind(this.socket);
  }

  _onerror = ({ message, error } : SocketMessageError) => {
    window.WEB.socketError(error, message);
  }
  _farwell = (timestamp:string) => {
    // SECTION GAME-START 
    window.UI.start(timestamp);
    if (this.socket) this.terminateSocket();
  }
  _hostChange = ({ host } : SocketMessageHostChange) => {
    window.WEB.hostChange(host);
  }
  _otherjoin = ({ id } : SocketMessageJoin) => {
    this._fromPeer(id);
    this.peers[id].createOffer(this._socketsend, id);
  }
  _offer = ({ from, offer } : SocketMessageOffer) => {
    this._fromPeer(from);
    this.peers[from].handleOffer(this._socketsend, offer);
  }
  _answer = ({ from, answer } : SocketMessageAnswer) => this.peers[from].handleAnswer(answer);
  _candidate = ({ from, candidate } : SocketMessageCandidate) => {
    this._fromPeer(from);
    this.peers[from].handleCandidate(candidate);
  }
  _removePeer = (id:string) => {
    if (this.peers[id]) this.peers[id].close();
    delete this.peers[id];
  }
  _fromPeer = (id:string) => {
    if (!this.peers[id]) {
      this.peers[id] = new Peer(this._socketsend, id, this._removePeer);
      window.WEB.newPeer(id);
    }
  }

  // room
  create(room:string, password:string) {
    this.socket.send({ type: SocketTypes.Create, room, password } as SocketRequestCreate);
  }
  connect(room:string, password:string) {
    this.socket.send({ type: SocketTypes.Join, room, password } as SocketRequestJoin);
  }

  // control
  terminateSocket() { 
    if (this.socket) this.socket.close();
  }

  systemSend(message:PeerSystemMessage) {
    for (const peer in this.peers) {
      this.peers[peer].systemSend(JSON.stringify(message));
    }
  }
  
  start () {
    this.socket.send({ type: SocketTypes.Farwell });
  }

  // UNITY-TO-WEB
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
  disconnect () {
    this.terminateSocket();
    for (const id in this.peers) {
      this._removePeer(id);
    }
  }
}

export default Bridge;