import { SocketErrorType, SET_UNITY_PREFERENCE } from "./common";
import { MODE, UnityOnProgress, IUnityInstance, PeerSystemMessageType } from "./types";

window.UI = {
  Create: function () {
    const info = gatherInfo();

    window.RTC.create(info.room, info.password);
  },
  Connect: function () {
    const info = gatherInfo();

    window.RTC.connect(info.room, info.password);
  },
  start: function(timestamp:string) {
    window.MODE = MODE.GAME;
    setActive('loading');

    // load in unity script
    LoadUnity(timestamp);
  },
  disconnect: (id) => {
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

function setActive(name) {
  console.log('setting active', name);
  const current = document.querySelector('section.active');
  if (current) {
    console.log('found current', current.classList);
    current.classList.remove('active');
  }

  const target = document.querySelector(`section.${name}`);
  target.classList.add('active');
}

async function LoadUnity(timestamp:string) {
  if (!window.UNITY.loaded) {
    console.log('UNITY LOADING...');
    window.UNITY.loaded = true;
    console.log('timestamp', timestamp);

    const response = await fetch('/set-unity-preference', {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        id: window.ID,
        room: window.ROOM,
      } as SET_UNITY_PREFERENCE)
    })
    const { name } = await response.json();

    console.log('GAME version:', name);

    const script = document.createElement("script");
    script.src = '/Build/UnityLoader.js'; //NOTE hard coded but can easily be changed to work with multiple versions
  
    script.onload = function () {
      // TODO request specific game based on dimensions
      // window.UNITY.start(timestamp);
      // window.unityInstance = UnityLoader.instantiate("unityContainer", "Build/alpha.json", {onProgress: UnityOnProgress});
      
      setActive('game');
      window.UNITY.instance = window.UNITY.Loader.instantiate("unityContainer", `Build/${name}.json`, { onProgress });
    }
    document.head.appendChild(script);
  }
  
}

// progress = [0, 1]
function onProgress (unityInstance: IUnityInstance, progress: number) {
  console.log('PROGRES', progress);

  unityInstance.onError = err => {
    console.log('UUUUUNITY ERROR', err)
  };
  if (progress >= 1) { // you never know..
    // console.clear();
    console.log('UNITY IS NOW LOADED')
    unityInstance.SetFullscreen();
    window.RTC.systemSend({ type: PeerSystemMessageType.GAME_LOADED });
  }
}

window.onload = () => {
  setActive('menu');
}