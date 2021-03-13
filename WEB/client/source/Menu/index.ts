window.WEB = {
  socketError: (type, message) => {
    console.error(`socketError type: ${type}, message: ${message}`);
    // sendToUnity("socketError", message);
  },
  answerError: (peer_id, error) => {
    console.log(`Answer Error from : ${peer_id} - ${error.message}`);
    // sendToUnity("answerError", `${peer_id}#${error.message}`);
  },
  connectionUpdate: (id, state) => {
    console.log(`connectionUpdate id: ${id}, state: ${state}`);
    // sendToUnity("connectionUpdate", `${id}#${state}`);
  },
  channelUpdate: (label, state) => {
    console.log(`channelUpdate label: ${label} state: ${state}`);
    // sendToUnity("channelUpdate", `${label}#${state}`);
  },
  setID: (id, room) => {
    console.log(`Connected to Room ${room} with ID : ${id}`);
    window.ID = id;
    window.ROOM = room;
    // sendToUnity("setID", `${id}#${room}`);
  },
  // newPeer: (peer_id) => { // DEAD FUNCTION
  //   // should already be cought from Bridge
  //   console.log(`Incomming peer connection : ${peer_id}`);
  //   // sendToUnity("newPeer", peer_id);
  // },
  error: (type, peer_id, error) => {
    console.log(`error type: ${type} peer_id: ${peer_id} error: ${error}`);
    // sendToUnity("error", `${type}#${peer_id}#${error}`);
  },
  hostChange: (host) => {
    console.log(`hostChange : ${host}`);
    // sendToUnity("hostChange", host);
    window.HOST = host;
  },
}

window.UI = {
  Create: function () {
    const info = gatherInfo();

    window.RTC.create(info.room, info.password);
  },
  Connect: function () {
    const info = gatherInfo();

    window.RTC.connect(info.room, info.password);
  }
}

function gatherInfo(): { room:string, password: string } {
  const room:string = document.querySelector("#room").nodeValue;
  const password:string = document.querySelector("#password").nodeValue;

  return { room, password }
}