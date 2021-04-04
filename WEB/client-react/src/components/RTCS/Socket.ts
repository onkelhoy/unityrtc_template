import { 
  ITargetSocketMessage,
  SocketMessageType,
  ISocketMessage, 
  ISignalMessage,
} from 'types.global';
import { IPeerUtils, ISocket } from './types';

export default class Socket implements ISocket {
  ws;
  peerUtils;
  id = "no-id";

  constructor (peerUtils:IPeerUtils) {
    // TODO could improve by not using href but maybe origin?
    const url = /https?(.*)/.exec(window.location.href) || ["", "ERROR.url-split.error"];
    this.ws = new WebSocket(`ws${url[1]}`);

    this.ws.onmessage = this._message.bind(this);
    this.ws.onerror = this._error.bind(this);
    this.ws.onopen = this._open.bind(this);
    this.ws.onclose = this._close.bind(this);

    this.peerUtils = peerUtils;
  }

  _message(event:MessageEvent<string>) {
    const message = JSON.parse(event.data) as ISocketMessage;
    switch (message.type) {
      case SocketMessageType.Heartbeat: {
        this.Send({ type: SocketMessageType.Heartbeat });
        break;
      }
      case SocketMessageType.Leave: {
        this.peerUtils.Leave(message as ITargetSocketMessage);
        break;
      }
      case SocketMessageType.Join: {
        this.peerUtils.Join(message as ITargetSocketMessage);
        break;
      }
      case SocketMessageType.Signal: {
        this.peerUtils.Signal(message as ISignalMessage)
        break;
      }
      case SocketMessageType.Farwell: {
        this.ws.close();
        break;
      }
    }
  }
  _error(error:Event) {
    console.log('Socket error', error);
  }
  _open(event:Event) {
    console.log('Socket open', event);
  }
  _close(event:Event) {
    console.log('Socket close', event);
  }
  
  Send(message: ISocketMessage) {
    try {
      this.ws.send(JSON.stringify({ ...message, from: this.id } as ISocketMessage));
    }
    catch (error) {
      console.error('something went wrong', error);
      alert('could not send via socket');
    }
  }
}