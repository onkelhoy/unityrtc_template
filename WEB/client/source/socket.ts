import { 
  SocketMessage,
  SocketMessageError,
  SocketTypes,
  SocketMessageLeave,
  SocketMessageJoinAnswer,
} from './common.types';
import { SocketEvents } from './types';

class Socket {
  ws:WebSocket;
  events:SocketEvents;

  constructor(url:string) {
    this.events = {};

    this.ws = new WebSocket(url);
    this.ws.onmessage = this.message.bind(this);
  }

  on(event:string, callback:Function) {
    if (!this.events[event]) this.events[event] = new Array<Function>();

    this.events[event].push(callback);
  }

  fire(event:string, ...params:[any]) {
    if (this.events[event]) this.events[event].forEach((cb) => cb(...params));
  }

  send(data:SocketMessage) {
    const msg = JSON.stringify(data);
    this.ws.send(msg);
  }

  error({ error, message } : SocketMessageError) {
    this.fire("error-" + error, message);
  }

  message(msg:MessageEvent) {
    const data = JSON.parse(msg.data) as SocketMessage;

    if (this.events[data.type]) {
      this.fire(data.type, data);
    }

    switch (data.type) {
      case SocketTypes.Error:
        return this.error(data as SocketMessageError);
      case SocketTypes.Leave: {
        const { id } = data as SocketMessageLeave;
        window.UNITY.disconnect(id);
        break;
      }
      case SocketTypes.JoinAnswer: {
        const { id, host } = data as SocketMessageJoinAnswer;
        window.peerID = id;
        window.host = host;
        break;
      }
      case SocketTypes.Farwell:
        console.log("[SOCKET] Goodbye, thats it! out and fly child!");
        this.ws.close();
        break;
      default:
        break;
    }
  }
}

export default Socket;