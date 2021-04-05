import React from "react";
import { 
  ISignalMessage, 
  ITargetSocketMessage, 
  ITargetJoinSocketMessage, 
  ISocketJoinMessage, 
  SocketMessageType 
} from "types.global";

import Peer from './Peer';
import Socket from './Socket';
import { 
  IContext, 
  IPeerUtils, 
  ISocket, 
  Tpeers, 
  SetType,
  SocketReadyState,
  PeerMessageType,
  IPeerMessage,
} from './types';
import Context from './context';

interface IState {
  ROOM:string;
  ID:string;
  HOST:string;
  USERNAME:string;
  peers:Tpeers;
}
interface IProps {};
interface IRTCS {
  socket: undefined|ISocket;
  state: IState;
  props: IProps;
}

const CHANNELS:string[] = ['game'];

class RTCS extends React.Component implements IRTCS {
  state = {
    ROOM: '',
    ID: '',
    HOST: '',
    USERNAME: '',
    canstart: false,

    peers: {} as Tpeers,
  };

  // ["system", "default"]

  socket;
  loaded = 0;

  constructor(props: IProps) {
    super(props);
    this.socket = new Socket({
      Join: this._peerjoin,
      Leave: this._peerleave,
      Signal: this._peersignal,
      Host: this._hostchange,
    } as IPeerUtils);
  }

  _peerjoin (message: ITargetJoinSocketMessage) {
    const peer = this._createPeer(message.target);
    peer.username = message.username;
    peer.signal();
    this.setState({ peers: { ...this.state.peers, [peer.id]: peer } });
  }
  _peerleave (message: ITargetSocketMessage) {
    const peer = this.state.peers[message.target];
    if (peer) {
      peer.disconnect();

      const copy = { ...this.state.peers };
      delete copy[message.target];
      this.setState({ peers: copy });
    }
  }
  _peersignal (message: ISignalMessage) {
    const peer = this._createPeer(message.target);

    peer.signal(message);
  }
  _createPeer(target:string) {
    let peer = this.state.peers[target];
    if (!peer) peer = new Peer(target, CHANNELS, this.socket.Send, this.state.USERNAME);

    peer.onSystemMessage = this._onsystemmessage.bind(this);
    return peer;
  }
  _hostchange(message: ITargetSocketMessage) {
    this.setState({ HOST: message.target });
  }
  _onsystemmessage(target:string, event:MessageEvent) {
    const message = JSON.parse(event.data) as IPeerMessage;
    switch(message.type) {
      case PeerMessageType.start: {
        console.log('GOT THE START MESSAGE')
        // TODO set dimensions and gather the game
        break;
      }
      case PeerMessageType.disconnect: {
        this._peerleave({ target, type: SocketMessageType.Leave } as ITargetSocketMessage);
        break;
      }
      case PeerMessageType.all: {
        this.setState({ canstart: true });
        break;
      }
      case PeerMessageType.loaded: {
        this.loaded++;
        if (!this.state.canstart && this.loaded === Object.keys(this.state.peers).length) {
          this.SystemBroadcast({ type: PeerMessageType.all });
          this.setState({ canstart: true });
        }
        break;
      }
    }
  }

  SystemBroadcast(message:IPeerMessage) {
    const msg = JSON.stringify(message);
    for (const id in this.state.peers) {
      this.state.peers[id].SystemSend(msg);
    }
  }

  // outgoing methods
  Send = (target:string, message:string, channels?:string|string[]):Boolean => {
    if (this.state.peers[target]) return this.state.peers[target].Send(message, channels);
    return false;
  }

  Broadcast = (message:string, channels?:string|string[]):Boolean => {
    let ok:Boolean = true;
    for (const id in this.state.peers) {
      ok = ok && this.state.peers[id].Send(message, channels);
    }

    return ok;
  }

  Disconnect = () => {
    if (this.socket.ws.readyState === SocketReadyState.open) {
      this.socket.Send({ type: SocketMessageType.Leave });
    } 
    
    for (const peerid in this.state.peers) {
      this.state.peers[peerid].disconnect();
    }
  }

  Join = (room:string, username:string, password?:string) => {
    this.setState({ ROOM: room, USERNAME: username });
    this.socket.Send({ type: SocketMessageType.Join, room, password, username } as ISocketJoinMessage)
  }

  render() {

    const provides:IContext = {
      Send: this.Send,
      Join: this.Join,
      peers: Object.values(this.state.peers),
      username: this.state.USERNAME,
      id: this.state.ID,
      host: this.state.HOST,
      Disconnect: this.Disconnect,
      Broadcast: this.Broadcast,
      SystemBroadcast: this.SystemBroadcast,
    };

    return (
      <Context.Provider value={provides}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { Context, SetType }
export default RTCS;