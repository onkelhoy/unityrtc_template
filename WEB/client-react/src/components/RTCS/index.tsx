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

    peers: {} as Tpeers,
  };

  // ["system", "default"]

  socket;

  constructor(props: IProps) {
    super(props);
    this.socket = new Socket({
      Join: this._peerjoin,
      Leave: this._peerleave,
      Signal: this._peersignal,
    } as IPeerUtils);
  }

  _peerjoin (message: ITargetJoinSocketMessage) {
    if (!this.state.peers[message.target]) {
      const peer = new Peer(message.target, CHANNELS, this.socket.Send, this.state.USERNAME);
      peer.username = message.username;
      peer.signal();
      this.setState({ peers: { ...this.state.peers, [peer.id]: peer } });
    }
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
    const peer = this.state.peers[message.target];
    if (peer) peer.signal(message);
  }

  // _getPeer(id:string) {
  //   let peer = this.state.peers[id];
  //   if (!peer) {
  //     peer = new Peer(id, CHANNELS, this.socket.Send);
  //     this.setState({ [id]: Peer });
  //   }

  //   return peer;
  // }


  // outgoing methods
  Send = () => {

  }

  Broadcast = () => {

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

  Set = (type:SetType, value:string) => {
    this.setState({ [type]: value });
  }

  render() {

    const provides:IContext = {
      Send: this.Send,
      Join: this.Join,
      Leave: this.Leave,
      Set: this.Set,
      Broadcast: this.Broadcast,
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