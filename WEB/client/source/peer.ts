import { 
  SocketRequestAnswer, 
  SocketRequestCandidate, 
  SocketRequestOffer, 

  SocketTypes
} from './common.types';
import { SendFunction } from './types';

interface Channel {
  channel:RTCDataChannel,
  queue:string[],
}

class Peer {
  remote:string;
  channelSchema:[string];
  connection:webkitRTCPeerConnection;
  channels:{[key:string]:Channel};
  close:Function;

  constructor(send:SendFunction, remote:string, close:Function, channels:[string] = ["default"]) {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    let pc:RTCPeerConnection = null;
    if (window.RTCPeerConnection) {
      pc = new RTCPeerConnection(configuration);
    }
    else {
      pc = new webkitRTCPeerConnection(configuration);
    }

    // setup ice-handeling
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        send({
          type: SocketTypes.Candidate,
          candidate: event.candidate,
          to: this.remote,
          from: window.peerID
        } as SocketRequestCandidate);
      }
    };
    // pc.onicegatheringstatechange = () => {
    //   console.log("ICE gathering state");
    // };
    pc.onicecandidateerror = (error) =>
      window.UNITY.error("ice", this.remote, error.errorText);

    // pc.oniceconnectionstatechange = (evt) => {
    //   console.log("ICE state change", evt);
    // };

    pc.onconnectionstatechange = this.ConnectionStateChange.bind(this);
    pc.ondatachannel = this.onDataChannel.bind(this);

    this.remote = remote;
    this.channelSchema = channels;
    this.channels = {};
    this.close = close;
    this.kill = this.kill.bind(this);

    this.connection = pc;
  }

  kill() {
    for (const label in this.channels) {
      if (this.channels[label].channel?.close instanceof Function)
        this.channels[label].channel.close();
    }

    this.connection.close();
    window.UNITY.disconnect(this.remote);
    this.close(this.remote);
  }

  ConnectionStateChange() {
    // must exist
    window.UNITY.connectionUpdate(this.remote, this.connection.connectionState);

    switch (this.connection.connectionState) {
      case "closed":
      case "disconnected":
      case "failed":
        this.kill();
        break;
    }
  }

  onDataChannel(event: RTCDataChannelEvent) {
    const channel = event.channel;
    this.setUpChannel(channel);
  }

  setUpChannel(channel:RTCDataChannel) {
    channel.onmessage = (event) => this.onChannelMessage(channel.label, event);
    channel.onerror = (error) => this.onChannelError(channel.label, error);
    channel.onopen = () => this.onChannelOpen(channel.label);
    channel.onclose = (event) => this.onChannelClose(channel.label, event);

    console.log("incomming channel:", channel.label);
    this.channels[channel.label] = {
      channel,
      queue: [],
    };
  }

  createChannel(name:string) {
    const channel = this.connection.createDataChannel(name);
    this.setUpChannel(channel);
  }

  onChannelOpen(label:string) {
    if (this.channels[label].queue.length > 0) {
      // sending all messages in queue
      console.log("rensing queue", label, this.channels[label].queue.length);
      for (const message of this.channels[label].queue) {
        this.send(message, label);
      }
      this.channels[label].queue = [];
    }
  }

  onChannelClose(label:string, event:Event) {
    console.log("channel is closed", label, event.type);
    window.UNITY.channelUpdate(label, "closed");
  }

  onChannelMessage(name:string, event: MessageEvent) {
    window.UNITY.message(name, this.remote, event.data);
  }

  onChannelError(name:string, event:RTCErrorEvent) {
    window.UNITY.error("channel", name, event.error.message);
  }

  createOffer(send:SendFunction, from:string) {
    for (const c of this.channelSchema) {
      this.createChannel(c);
    }

    return this.connection
      .createOffer()
      .then((offer) => {
        send({ type: SocketTypes.Offer, to: from, from: window.peerID, offer } as SocketRequestOffer);

        this.connection.setLocalDescription(offer);
      })
      .catch((error) => {
        console.error("offer-error", error);
        alert("Error when creating an offer");
      });
  }

  handleOffer(send:SendFunction, desription:RTCSessionDescriptionInit) {
    // we are connecting
    this.connection.setRemoteDescription(new RTCSessionDescription(desription));

    // creating and sending an answer to the offer
    return this.connection
      .createAnswer()
      .then((answer) => {
        this.connection.setLocalDescription(answer);

        send({ type: SocketTypes.Answer, answer, to: this.remote, from: window.peerID } as SocketRequestAnswer);
      })
      .catch((error) => {
        console.error("answer-error", error);
        alert("Error when creating an answer");
      });
  }

  handleAnswer(desription:RTCSessionDescriptionInit) {
    this.connection.setRemoteDescription(new RTCSessionDescription(desription));
  }

  handleCandidate(candidate:RTCIceCandidateInit) {
    this.connection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  handleLeave() {
    this.connection.close();
    this.connection.onicecandidate = null;
    this.close();
  }

  send(message:string, channels:string[]|string) {
    if (typeof channels === "string") {
      channels = [channels];
    }
    if (!channels) {
      channels = Object.keys(this.channels);
    }

    // console.log("sending message", message, channels);

    for (const label of channels) {
      if (this.channels[label].channel.readyState === "open") {
        this.channels[label].channel.send(message);
      } else {
        // store if for later
        this.channels[label].queue.push(message);
      }
    }
  }
}

export default Peer;
