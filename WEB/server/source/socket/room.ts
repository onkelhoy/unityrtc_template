import { sendTo } from "../utils";
import { Socket } from "../types";
import { SocketMessage, ErrorSocketMessage, JoinAnswerMessage, SocketSuccessType } from 'unityrtc-types';

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

  join(user:Socket, password:string):ErrorSocketMessage|JoinAnswerMessage {
    if (password !== this.password) {
      return { type: "error", error: "password", message: "incorrect password", code: 2 } as ErrorSocketMessage;
    }
    // notify all
    const id = `${this.name}#${this.count}`;
    user.id = id;
    user.room = this.name;
    this.count++;

    if (!this.host) {
      this.host = id;
    } else this.broadcast(user, { type: "join" });

    this.users[id] = user;
    return { type: "success", success: SocketSuccessType.Join, id,  } as JoinAnswerMessage;
  }

  leave(user:Socket) {
    delete this.users[user.id];
    // notify all in room
    this.count--;
    if (this.count > 0) {
      this.broadcast(user, { type: "leave" });
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
      this.broadcast(null, { type: "farwell" });
    } else this.send(user.id, { type: "error", message: "You are not host", error: "unothorized", code: -1 } as ErrorSocketMessage);
  }

  send(id:string, message:SocketMessage) {
    if (!this.users[id]) return false;

    sendTo(this.users[id], message);
    return true;
  }
};

export default Room;