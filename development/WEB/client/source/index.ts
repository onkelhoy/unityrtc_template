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
    }

    connect:Function;
    set_name:Function;
    create:Function;
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
  }
};


// temp functions for 
window.connect = function () {
  const room = (document.querySelector("#room") as HTMLInputElement).value;
  const password = (document.querySelector("#password") as HTMLInputElement).value;
  window.RTC.connect(room, password);
}

window.set_name = function() {
  const name = (document.querySelector("#name") as HTMLInputElement).value;
  window.RTC.login(name, "123");
}

window.create = function() {
  const room = (document.querySelector("#room") as HTMLInputElement).value;
  const password = (document.querySelector("#password") as HTMLInputElement).value;

  window.RTC.create(room, password);
}
