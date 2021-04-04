import WebSocket from "ws";
import { sendTo } from "utils";

import {
  SocketMessageType,
  ISocketMessage,
  ISignalMessage,
  ISocketJoinMessage,
  ErrorType,
  ISocketMessageError,
} from 'types.global';

import { ISocket } from './types';

import Room from "./room";

const rooms:{[key:string]: Room} = {};
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", function (user:ISocket) {
  user.on("message", onMessage.bind(user));
  user.on('close', onClose.bind(user));
});

function onMessage(this:ISocket, message: string) {
  const data = JSON.parse(message) as ISocketMessage;
  const user = this;

  switch (data.type) {
    case SocketMessageType.Signal:
      return signal(user, data as ISignalMessage);
    case SocketMessageType.Leave:
      return leave(user);
    case SocketMessageType.Join:
      return join(user, data as ISocketJoinMessage);
    case SocketMessageType.Farwell:
      return farwell(user);
  }
}


function signal(user:ISocket, message:ISignalMessage) {
  roomCheck(user, () => {
    const signalMSG:ISignalMessage = { ...message, target: user.id };
    rooms[user.room].send(message.target, signalMSG);
  });
}

function onClose(this:ISocket) {
  leave(this);
} 

function roomCheck(user:ISocket, cb:Function) {
  const { room } = user;

  if (!!rooms[room]) cb();
  else {
    sendTo(user, {
      type: SocketMessageType.Error,
      error: ErrorType.Connect,
    } as ISocketMessageError);
  }
}

function farwell(user:ISocket) {
  roomCheck(user, () => {
    if (rooms[user.room].farwell(user)) {
      delete rooms[user.room];
      console.log('room deleted', user.room);
    } 
  });
}

function join(user:ISocket, message:ISocketJoinMessage) {
  if (!rooms[message.room]) {
    rooms[message.room] = new Room(message.room, message.password);
  }
  rooms[message.room].join(user, message);
}

function leave(user:ISocket) {
  roomCheck(user, () => {
    rooms[user.room].leave(user);

    if (rooms[user.room].count === 0) {
      console.log(user.room, 'is now free again')
      delete rooms[user.room];
      // NOTE can expand this so room stays and collects info at end of game
      // and only then it will be "free" 
      // this requires interval checks (every hour check if rooms has existed more than x amount then delete)
    } 
  });
}

export default wss;
