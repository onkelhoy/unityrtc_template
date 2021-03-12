import { sendTo } from "../utils";
import { Socket } from "../types";
import { 
  SocketMessage, 
  SocketMessageLeave,
  SocketMessageJoin,
  SocketMessageJoinAnswer,
  SocketMessageError, 
  SocketTypes,
  SocketErrorType
} from '../common.types';

class Room {
  name:string;
  password:string;
  users:{[key: string]:Socket}
  count:number;
  host:string|null;

  constructor(name:string, password = "") {
    this.name = name;
    this.password = password;
    this.users = {};
    this.count = 0;
    this.host = null;
  }

  join(user:Socket, password:string):void {
    if (password !== this.password) {
      sendTo(user, { type: SocketTypes.Error, error: SocketErrorType.Join, message: "incorrect password" } as SocketMessageError);
    }
    // notify all
    const id = `${this.name}#${this.count}`;
    user.id = id;
    user.room = this.name;
    this.count++;

    if (!this.host) {
      this.host = id;
    } else this.broadcast(user, { type: SocketTypes.Join, id: user.id } as SocketMessageJoin);

    this.users[id] = user;
    sendTo(user, { type: SocketTypes.JoinAnswer, id, host: this.host, room: this.name } as SocketMessageJoinAnswer);
  }

  leave(user:Socket) {
    this.users[user.id].close();
    delete this.users[user.id];
    // notify all in room
    this.count--;
    if (this.count > 0) {
      this.broadcast(user, { type: SocketTypes.Leave, id: user.id } as SocketMessageLeave);
      this.host = Object.keys(this.users)[0];
    }
  }

  broadcast(sender:Socket|null, message:SocketMessage) {
    const data = { ...message, id: sender?.id };

    for (const id in this.users) {
      if (sender && id === sender.id) {
        continue;
      }
      sendTo(this.users[id], data);
    }
  }

  farwell(user:Socket) {
    if (user.id === this.host) {
      this.broadcast(null, { type: SocketTypes.Farwell });
      return true;
    } 
    
    this.send(user.id, { 
      type: SocketTypes.Error, 
      message: "You are not host", 
      error: SocketErrorType.Host, 
      code: -1 
    } as SocketMessageError);
    return false;
  }

  send(id:string, message:SocketMessage) {
    if (!this.users[id]) return false;

    sendTo(this.users[id], message);
    return true;
  }
};

export default Room;