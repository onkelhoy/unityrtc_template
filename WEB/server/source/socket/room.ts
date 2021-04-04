import { sendTo } from "utils";
import { 
  ISocketMessage, 
  ITargetSocketMessage,
  ITargetJoinSocketMessage,
  ISocketJoinMessage,
  ISocketConnectMessage,
  ISocketMessageError, 
  SocketMessageType,
  ErrorType,
} from 'types.global';
import { ISocket } from "./types";

class Room {
  name:string;
  password:string;
  users:{[key: string]:ISocket}
  count:number;
  idcounter:number;
  host:string|null;

  constructor(name:string, password = "") {
    this.name = name;
    this.password = password;
    this.users = {};
    this.count = 0;
    this.idcounter = 0;
    this.host = null;

    console.log('creating room', name)
  }

  join(user:ISocket, message:ISocketJoinMessage):void {
    if (message.password !== this.password) {
      sendTo(user, { 
        type: SocketMessageType.Error, 
        error: ErrorType.Password, 
      } as ISocketMessageError);
    }
    // notify all
    const id = `${this.name}#${this.idcounter}`;
    user.id = id;
    user.room = this.name;
    
    this.count++;
    this.idcounter++;

    if (!this.host) {
      this.host = id;
    } else this.broadcast(user, { 
      type: SocketMessageType.Join, 
      target: id,
      username: message.username,
    } as ITargetJoinSocketMessage);

    this.users[id] = user;
    sendTo(user, { type: SocketMessageType.Connect, host: this.host, room: this.name } as ISocketConnectMessage);
  }

  leave(user:ISocket) {
    if (this.users[user.id]) this.users[user.id].close();
    delete this.users[user.id];
    // notify all in room

    this.count--;
    if (this.count > 0) {
      this.broadcast(user, { 
        type: SocketMessageType.Leave, 
        target: user.id 
      } as ITargetSocketMessage);
      this.host = Object.keys(this.users)[0];
    }
  }

  broadcast(sender:ISocket|null, message:ISocketMessage) {
    const data = { ...message, id: sender?.id };

    for (const id in this.users) {
      if (sender && id === sender.id) {
        continue;
      }
      sendTo(this.users[id], data);
    }
  }

  farwell(user:ISocket) {
    if (user.id === this.host) {
      this.broadcast(null, { type: SocketMessageType.Farwell });
      return true;
    } 
    
    this.send(user.id, { 
      type: SocketMessageType.Error, 
      // message: "You are not host", 
      error: ErrorType.Host, 
      code: -1 
    } as ISocketMessageError);
    return false;
  }

  send(id:string, message:ISocketMessage) {
    if (!this.users[id]) return false;

    sendTo(this.users[id], message);
    return true;
  }
};

export default Room;