import Bridge from './bridge';

declare global {
  interface Window { 
    RTC: Bridge; 
    UNITY: {
      connectionUpdate: (id:string, state:RTCPeerConnectionState) => void;
      channelUpdate: (label:string, state:RTCPeerConnectionState) => void;
      message: (channel:string, peer_id:string, msg:string) => void;
      error: (type:string, peer_id:string, error:string) => void;
      disconnect: (peer_id:string) => void;
      hostChange: (host:string) => void;
    },
    peerID:string;
    host:string;
  }
}

window.RTC = new Bridge();

window.UNITY = {
  connectionUpdate: (id, state) => {
    console.log("state update", id, state);
  },
  message: (channel, peer_id, msg) => {
    console.log(`new message from ${peer_id} on ${channel}: ${msg}`);
  },
  error: (type, peer_id, error) => {
    console.log("oh no, error!", peer_id, type, error);
  },
  channelUpdate: (label, state) => {
    console.log("new update for channel", label, state);
  },
  disconnect: (peer_id) => {
    console.log("peer disonnect", peer_id);
  },
  hostChange: (host) => {
    console.log('new host', host);
  },
};
