import { 
  ISignalMessage,
  SocketMessageType, 
  SignalType,
  IOfferMessage,
} from "types.global";

import { 
  TSocketSendF, 
  IChannel, 
  IChannelMessage, 
  IPeer, 
  PeerStatus, 
} from "./types";

import { Itryuntil, tryuntil } from 'utils';

const SYSTEM_NAME = 'system';
const MAX_TRIES = 4; // maximum number of tries to resend message (queue system)

type TChannels = {[key:string]: IChannel};
export default class Peer implements IPeer {
  channels = {} as TChannels;
  connection;
  id;
  offerGenerator;
  answerGenerator;
  username;
  status = PeerStatus.signaling;

  constructor(id:string, channels: string[], socketsend: TSocketSendF, myusername:string) {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    if (window.RTCPeerConnection) {
      this.connection = new RTCPeerConnection(configuration);
    }
    else {
      this.connection = new webkitRTCPeerConnection(configuration);
    }

    this.channels[SYSTEM_NAME] = new Channel(SYSTEM_NAME, id);
    for (const name of channels) {
      if (name !== SYSTEM_NAME) this.channels[name] = new Channel(name, id);
    }
    this.id = id;

    this.username = 'no-username';
    this.offerGenerator = tryuntil(this._createOffer, socketsend, myusername);
    this.answerGenerator = tryuntil(this._createAnswer);
    this.connection.onicecandidate = event => this._onicecandidate(event, socketsend);
    this.connection.ondatachannel = this._ondatachannel.bind(this);
  }

  async _createOffer(_index:number, socketsend: TSocketSendF, myusername:string) {
    const offer = await this.connection.createOffer();
    this.connection.setLocalDescription(offer);
    socketsend({ 
      type: SocketMessageType.Signal, 
      signal: SignalType.Offer,
      target: this.id, 
      data: offer,
      username: myusername
    } as IOfferMessage);
  }
  async _createAnswer(_index:number, socketsend: TSocketSendF) {
    const answer = await this.connection.createAnswer();
    this.connection.setLocalDescription(answer);
    
    socketsend({ 
      type: SocketMessageType.Signal, 
      signal: SignalType.Answer,
      target: this.id, 
      data: answer, 
    } as ISignalMessage);
  }
  async _try(generator:Itryuntil) {
    while (true) {
      const data = await generator.next();

      if (data.done) break;
      if (data.value.data) return;
    }
  }
  _ondatachannel (event: RTCDataChannelEvent) {
    const channel = event.channel;
    if (this.channels[channel.label]) this.channels[channel.label].Init(channel, this);
    else {
      const c = new Channel(channel.label, this.id);
      c.Init(channel, this);

      this.channels[channel.label] = c;
    }
  }
  // when candidate is created from our side
  _onicecandidate = (event: RTCPeerConnectionIceEvent, socketsend: TSocketSendF) => {
    if (event.candidate) {
      socketsend({
        type: SocketMessageType.Signal,
        signal: SignalType.Candidate,
        data: event.candidate,
        target: this.id,
      } as ISignalMessage);
    }
  };

  ondatachannelclose = (name:string) => {
    if (!this.channels[name]) return;

    if (this.status === PeerStatus.open) {
      this.channels[name].Awake(this);
    }
    else delete this.channels[name]; 
  }
  onSystemMessage = (name:string, event:MessageEvent) => {
    console.log('system message method is overriden!');
  }
  ondatachannelmessage = (name:string, event:MessageEvent) => {
    if (name !== SYSTEM_NAME) {
      this.onSystemMessage(this.id, event);
    }
    else window.UNITY.message(name, this.id, event.data);
  }

  async signal(message?: ISignalMessage) {
    try {
      if (message) {
        switch (message.signal) {
          case SignalType.Offer: { // incomming offer
            // we are connecting
            this.status = PeerStatus.open;
            const { data, username } = message as IOfferMessage;
            this.username = username;
            this.connection.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
            this._try(this.answerGenerator);
            break;
          }
          case SignalType.Answer: { // incomming answer
            this.status = PeerStatus.open;
            const { data } = message as ISignalMessage;
            this.connection.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
            break;
          }
          case SignalType.Candidate: { // incomming candidate
            const { data } = message as ISignalMessage;
            this.connection.addIceCandidate(new RTCIceCandidate(data as RTCIceCandidateInit));
          }
        }
      }
      else { // creating an offer
        // awake all channels
        Object.values(this.channels).forEach(channel => channel.Awake(this));
        this._try(this.offerGenerator);
      }
    }
    catch (error) {
      console.error('Something big went wrong', error);
    }
  }

  disconnect() {
    this.status = PeerStatus.closed;

    for (const channel of Object.values(this.channels)) {
      channel.close();
    }

    this.connection.close();
  }

  SystemSend(message:string) {
    this.channels[SYSTEM_NAME].Send(message);
  }

  Send(message:string, channels?:string|string[]):Boolean {
    if (typeof channels === "string") {
      channels = [channels];
    }

    if (!channels) {
      // system
      channels = Object.keys(this.channels);
    }

    let allOK:Boolean = true;
    for (let name of channels) {
      if (name === SYSTEM_NAME) continue;

      if (this.channels[name]) {
        allOK = allOK && this.channels[name].Send(message);
      }
    }

    return allOK;
  }
}

// help

class Channel implements IChannel {
  queue = [] as IChannelMessage[];
  name;
  tries = 0;
  stream?:RTCDataChannel;

  constructor(name:string, peer:string) {
    this.name = name;
    this.queue = [];
  }

  close = () => {
    this.stream?.close();
  }

  onopen() {

  }
  onerror(error:RTCErrorEvent) {
    if (!this.stream || this.stream.readyState !== "open") {
      // TODO check connection state and reconnect if necessary (this time with peers)
    }
  }

  Init(channel:RTCDataChannel, peer:IPeer) {
    if (this.stream) this.stream.close();

    this.stream = channel; // overriding stream
    this.Awake(peer);
  }
  Awake(peer:IPeer) {
    if (this.tries < 10) {
      console.log('Data channel lost more then 10x now..');
      return;
    }
    this.tries++;
    if (!this.stream) {
      const stream = peer.connection.createDataChannel(this.name);
      this.stream = stream;
    }

    this.stream.onmessage = event => peer.ondatachannelmessage(this.name, event);
    this.stream.onerror = this.onerror.bind(this);
    this.stream.onopen = this.onopen.bind(this);
    this.stream.onclose = () => peer.ondatachannelclose(this.name);
  }
  Send(message:string): Boolean {
    if (!this.stream || this.stream.readyState !== "open") {
      this.queue.push({ message, tries: 0 });
      return false;
    }

    const newQueue = [];
    if (this.queue.length > 0) {
      for (const msg of this.queue) {
        if (!this.Send(msg.message) && msg.tries < MAX_TRIES) {
          newQueue.push({ ...msg, tries: msg.tries + 1 });
        }
      }
      this.queue = newQueue;
    }

    return true;
  }
}