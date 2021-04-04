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
  PeerMessageType, 
  IPeerMessage,
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

    this.channels[SYSTEM_NAME] = new Channel(SYSTEM_NAME);
    for (const name of channels) {
      if (name !== SYSTEM_NAME) this.channels[name] = new Channel(name);
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
    if (this.channels[channel.label]) this.channels[channel.label].Init(channel, this.connection);
    else {
      const c = new Channel(channel.label);
      c.Init(channel, this.connection);

      this.channels[channel.label] = c;
    }
  }
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

  async signal(message?: ISignalMessage) {
    try {
      if (message) {
        switch (message.signal) {
          case SignalType.Offer: {
            // we are connecting
            const { data } = message as ISignalMessage;
            this.connection.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
            this._try(this.answerGenerator);
            break;
          }
          case SignalType.Answer: {
            const { data } = message as ISignalMessage;
            this.connection.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
            break;
          }
          case SignalType.Candidate: {
            const { data } = message as ISignalMessage;
            this.connection.addIceCandidate(new RTCIceCandidate(data as RTCIceCandidateInit));
          }
        }
      }
      else {
        // awake all channels
        Object.values(this.channels).forEach(channel => channel.Awake(this.connection));
        this._try(this.offerGenerator);
      }
    }
    catch (error) {
      console.error('Something big went wrong', error);
    }
  }

  disconnect() {
    this.SystemSend({ type: PeerMessageType.disconnect });

    for (const channel of Object.values(this.channels)) {
      channel.close();
    }

    this.connection.close();
  }

  SystemSend(message:IPeerMessage) {
    this.channels[SYSTEM_NAME].Send(JSON.stringify(message));
  }

  Send(message:string, channels?:string|string[]):Boolean {
    if (typeof channels === "string") {
      channels = [channels];
    }

    if (!channels) {
      // system
      if (!this.channels[SYSTEM_NAME]) {
        console.log('system channel has not been created!');
        return false;
      }

      this.channels[SYSTEM_NAME].Send(message);
      return true;
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
  stream?:RTCDataChannel;

  constructor(name:string) {
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
  onclose() {
    // this data channel is trminated
  }
  onmessage(event:MessageEvent) {
    if (this.name !== SYSTEM_NAME) {
      console.log('incomming peer message on system channel', event.data);
      // TODO implement system type check (switch)
    }
    else {
      console.log('incomming peer message', event.data);
      // TODO call unity
    }
  }
  Init(channel:RTCDataChannel, connection:webkitRTCPeerConnection) {
    if (this.stream) this.stream.close();

    this.stream = channel; // overriding stream
    this.Awake(connection);
  }
  Awake(connection:webkitRTCPeerConnection) {
    if (!this.stream) {
      const stream = connection.createDataChannel(this.name);
      this.stream = stream;
    }

    this.stream.onmessage = this.onmessage.bind(this);
    this.stream.onerror = this.onerror.bind(this);
    this.stream.onopen = this.onopen.bind(this);
    this.stream.onclose = this.onclose.bind(this);
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