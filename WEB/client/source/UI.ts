import { SocketErrorType } from "./common.types";
import { MODE, UnityOnProgress, IUnityInstance, PeerSystemMessageType } from "./types";

window.UI = {
  Create: function () {
    const info = gatherInfo();

    console.log(info)

    window.RTC.create(info.room, info.password);
  },
  Connect: function () {
    const info = gatherInfo();

    window.RTC.connect(info.room, info.password);
  },
  start: function(timestamp) {
    window.MODE = MODE.GAME;
    document.querySelector("section.menu").classList.remove("active");
    document.querySelector("section.loading").classList.add("active");

    // load in unity script
    LoadUnity(timestamp);

    window.setTimeout(() => {
      document.querySelector("section.loading").classList.remove("active");
      document.querySelector("section.game").classList.add("active");
    }, 2000);
  },
  disconnect: (id) => {
    console.log('remove', id);
    const target = document.querySelector(`#peers > li#${id.replace('#', '-')}`);
    if (target) {
      target.parentNode.removeChild(target);
    }
  },
}


window.WEB = {
  socketError: (type, message) => {
    console.error(`socketError type: ${type}, message: ${message}`);

    switch (type) {
      case SocketErrorType.Host:
        document.querySelector("#lobbyerror").innerHTML = message;
        break;
      case SocketErrorType.Join:
      case SocketErrorType.Room:
        document.querySelector("#mainerror").innerHTML = message;
        break;
    }
  },
  answerError: (peer_id, error) => {
    console.log(`Answer Error from : ${peer_id} - ${error.message}`);
    alert("Problems With RTC answer");
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

    // switch view
    document.querySelector("section.menu > div.main").classList.toggle("active");
    document.querySelector("section.menu > div.lobby").classList.toggle("active");
    
    document.querySelector("#roomName").innerHTML = room;
    document.querySelector("#peers > li.you").innerHTML = id;
  },
  newPeer: (peer_id) => {
    console.log(`Incomming peer connection : ${peer_id}`);

    const li = document.createElement("li");
    li.setAttribute("id", peer_id.replace('#', '-'));
    li.innerText = peer_id;

    document.querySelector("#peers").appendChild(li);
  },
  error: (type, peer_id, error) => {
    console.log(`error type: ${type} peer_id: ${peer_id} error: ${error}`);
    // sendToUnity("error", `${type}#${peer_id}#${error}`);
  },
  hostChange: (host) => {
    console.log(`hostChange : ${host}`);

    window.HOST = host;
    (document.querySelector("#start") as HTMLInputElement).disabled = window.ID !== window.HOST;
  },
}


function gatherInfo(): { room:string, password: string } {
  const room:string = (document.querySelector("#room") as HTMLInputElement).value;
  const password:string = (document.querySelector("#password") as HTMLInputElement).nodeValue;

  return { room, password }
}

function LoadUnity(timestamp:string) {
  if (!window.UNITY.loaded) {
    window.UNITY.loaded = true;

    const script = document.createElement("script");
    script.src = window.UNITY.buildpath;
  
    script.onload = function () {
      // window.UNITY.start(timestamp);
      // window.unityInstance = UnityLoader.instantiate("unityContainer", "Build/alpha.json", {onProgress: UnityOnProgress});
      window.UNITY.instance = window.UNITY.loader.instantiate("unityContainer", window.UNITY.buildpath, { onProgress })
    }
    document.head.appendChild(script);
  }
  
}

// progress = [0, 1]
function onProgress (unityInstance: IUnityInstance, progress: number) {

  if (progress >= 1) { // you never know..
    window.RTC.systemSend({ type: PeerSystemMessageType.GAME_LOADED })
  }
}