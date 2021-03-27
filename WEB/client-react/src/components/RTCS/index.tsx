import React from "react";
import { ISignalMessage, ITargetSocketMessage } from "types";

import Peer from './Peer';
import Socket from './Socket';
import { IContext, IPeerUtils } from './types';
import Context from './context';

type Tpeers = {[key:string]: Peer};
interface IState {
  ROOM:string;
  ID:string;
  HOST:string;
  peers:Tpeers;
}

interface IProps {}

interface IRTCS {
  socket: undefined|Socket;
  state: IState;
  props: IProps;
}

const CHANNELS:string[] = ['game'];

class RTCS extends React.Component implements IRTCS {
  state = {
    ROOM: '',
    ID: '',
    HOST: '',

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

  _peerjoin (message: ITargetSocketMessage) {
    const peer = this._getPeer(message.target);
    peer.signal();
  }
  _peerleave (message: ITargetSocketMessage) {
    const peer = this._getPeer(message.target);
    peer.disconnect();

    const copy = { ...this.state.peers };
    delete copy[message.target];
    this.setState({ peers: copy });
  }
  _peersignal (message: ISignalMessage) {
    const peer = this._getPeer(message.target);
    peer.signal(message);
  }

  _getPeer(id:string) {
    let peer = this.state.peers[id];
    if (!peer) {
      peer = new Peer(id, CHANNELS, this.socket.Send);
      this.setState({ [id]: Peer });
    }

    return peer;
  }

  Send() {

  }

  render() {

    const provides:IContext = {
      Send: this.Send
    }

    return (
      <Context.Provider value={provides}>
        {this.props.children}
      </Context.Provider>
    );
  }
}


export default RTCS;