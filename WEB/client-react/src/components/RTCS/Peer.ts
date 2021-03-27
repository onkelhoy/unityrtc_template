import { 
  ISignalMessage, 
  SocketMessageType, 
  ICandidateMessage,
  IAnswerMessage,
  IOfferMessage,
  SignalType,
 } from "types";
import { TSocketSendF } from "./types";

import { Itryuntil, tryuntil } from 'utils';

type TChannels = {[key:string]: Channel};
interface IPeer {
  channels:TChannels;
  connection:RTCPeerConnection;
  id:string;
}

const SYSTEM_NAME = 'system';
const MAX_TRIES = 4; // maximum number of tries to resend message (queue system)

export default class Peer implements IPeer {
  channels = {} as TChannels;
  connection;
  id;
  offerGenerator;
  answerGenerator;

  constructor(id:string, channels: string[], socketsend: TSocketSendF) {
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

    this.offerGenerator = tryuntil(this._createOffer, socketsend);
    this.answerGenerator = tryuntil(this._createAnswer);
    this.connection.ondatachannel = this._ondatachannel.bind(this);
  }

  async _createOffer(_index:number, socketsend: TSocketSendF) {
    const offer = await this.connection.createOffer();
    this.connection.setLocalDescription(offer);
    socketsend({ 
      type: SocketMessageType.Signal, 
      stype: SignalType.Offer,
      target: this.id, 
      offer 
    } as IOfferMessage);
  }
  async _createAnswer(_index:number, socketsend: TSocketSendF) {
    const answer = await this.connection.createAnswer();
    this.connection.setLocalDescription(answer);
    
    socketsend({ 
      type: SocketMessageType.Signal, 
      stype: SignalType.Answer,
      target: this.id, 
      answer, 
    } as IAnswerMessage);
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

  async signal(message?: ISignalMessage) {
    try {
      if (message) {
        switch (message.stype) {
          case SignalType.Offer: {
            // we are connecting
            const { offer } = message as IOfferMessage;
            this.connection.setRemoteDescription(new RTCSessionDescription(offer));
            this._try(this.answerGenerator);
            break;
          }
          case SignalType.Answer: {
            const { answer } = message as IAnswerMessage;
            this.connection.setRemoteDescription(new RTCSessionDescription(answer));
            break;
          }
          case SignalType.Candidate: {
            const { candidate } = message as ICandidateMessage;
            this.connection.addIceCandidate(new RTCIceCandidate(candidate));
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
    for (const channel of Object.values(this.channels)) {
      if (channel.stream) channel.stream.close();
    }

    this.connection.close();
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
      if (this.channels[name]) {
        allOK = allOK && this.channels[name].Send(message);
      }
    }

    return allOK;
  }
}

// Helper classes

interface ChannelMessage {
  message:string;
  tries:number;
}

interface IChannel {
  stream?:RTCDataChannel,
  queue:ChannelMessage[],
}

class Channel implements IChannel {
  queue = [] as ChannelMessage[];
  name;
  stream?:RTCDataChannel;

  constructor(name:string) {
    this.name = name;
    this.queue = [];
  }

  _open() {

  }
  _error(error:RTCErrorEvent) {

  }
  _close() {
    
  }
  _message(event:MessageEvent) {

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

    this.stream.onmessage = this._message.bind(this);
    this.stream.onerror = this._error.bind(this);
    this.stream.onopen = this._open.bind(this);
    this.stream.onclose = this._close.bind(this);
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