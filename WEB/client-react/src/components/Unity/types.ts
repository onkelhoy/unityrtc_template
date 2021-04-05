export interface IUnityInstance {
  SendMessage: (GameObject:string, Method:string, Message:string) => void;
}

export interface IWindow {
  UNITY: {
    instance:null|IUnityInstance; // set once game is loaded
    message: (channel:string, peer_id:string, msg:string) => void;
    disconnect: (peer_id:string) => void;
    start: (timestamp:string, id:string, room:string, host:string, peers:string[]) => void;
  }
}