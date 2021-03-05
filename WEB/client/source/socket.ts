import { 
  LoginAnswerMessage, 
  SocketMessage,
  SuccessSocketMessage,
  ErrorSocketMessage,
} from 'unityrtc-types';
import { SocketEvents } from './types';

class Socket {
  ws:WebSocket;
  token:string|null;
  events:SocketEvents;

  constructor(url:string) {
    this.token = null;
    this.events = {};

    this.ws = new WebSocket(url);
    this.ws.onmessage = this.message.bind(this);

    this.on("success-login", ({ token }: LoginAnswerMessage) => {
      this.token = token;
    });
  }

  on(event:string, callback:Function) {
    if (!this.events[event]) this.events[event] = new Array<Function>();

    this.events[event].push(callback);
  }

  fire(event:string, ...params:[any]) {
    if (this.events[event]) this.events[event].forEach((cb) => cb(...params));
  }

  send(data:SocketMessage) {
    const msg = JSON.stringify({
      ...data,
      token: this.token,
    }); // potentail modification : OBS user id already known
    this.ws.send(msg);
  }

  error({ error, message } : ErrorSocketMessage) {
    this.fire("error-" + error, message);
  }

  success({ success, message } : SuccessSocketMessage) {
    this.fire("success-" + success, message);
  }

  message(msg:MessageEvent) {
    const { type, ...data } = JSON.parse(msg.data) as SocketMessage;

    if (this.events[type]) {
      this.fire(type, data);
    }

    switch (type) {
      case "success":
        return this.success(data as SuccessSocketMessage);
      case "error":
        return this.error(data as ErrorSocketMessage);
      case "farwell":
        console.log("[SOCKET] Goodbye, thats it! out and fly child!");
        this.ws.close();
        break;
      default:
        break;
    }
  }
}

export default Socket;