import WebSocket from "ws";
import { sendTo } from "../utils";
import { 
  SocketMessage, 
  Credentials, 
  ErrorSocketMessage, 
  SuccessSocketMessage,
  SocketCandidateMessage, 
  SocketAnswerMessage,
  SocketOfferMessage,
  SocketCreateMessage, 
  SocketJoinMessage, 
  SocketLoginMessage,
  SocketSuccessType,
} from '../global.types';
import { 
  Socket, 
} from '../types';

import Room from "./room";

const rooms:{[key:string]: Room} = {};
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", function (user:Socket) {
  user.on("message", onMessage.bind(user)); // binding just so ts can shutup..
});

function onMessage(this:Socket, message: string) {
  const data = JSON.parse(message) as SocketMessage;
  const user = this;

  switch (data.type) {
    case "offer":
      return offer(user, data as SocketOfferMessage);
    case "login":
      return login(user, (data as SocketLoginMessage).credentials);
    case "answer":
      return answer(user, data as SocketAnswerMessage);
    case "candidate":
      return candidate(user, data as SocketCandidateMessage);
    case "leave":
      return leave(user);
    case "join":
      return join(user, data as SocketJoinMessage);
    case "create": {
      return create(user, data as SocketCreateMessage);
    }
  }
}

function roomCheck(user:Socket, cb:Function) {
  const { room } = user;

  if (!!rooms[room]) cb();
  else {
    sendTo(user, {
      type: "error",
      error: "room",
      message: "Room is not existing",
      code: 4,
    } as ErrorSocketMessage);
  }
}

function join(user:Socket, message:SocketJoinMessage) {
  if (!message.token) {
    sendTo(user, rooms[message.room].join(user, message.password));
  }
  if (rooms[message.room]) {
    sendTo(user, rooms[message.room].join(user, message.password));
  } else {
    sendTo(user, {
      type: "error",
      error: "room",
      message: "Room is not existing",
      code: 4,
    } as ErrorSocketMessage);
  }
}

function answer(user:Socket, message: SocketAnswerMessage) {
  roomCheck(user, () => {
    const newMessage = { ...message, id: user.id };
    rooms[user.room].send(message.target, newMessage);
  });
}

function leave(user:Socket) {
  roomCheck(user, () => {
    rooms[user.room].leave(user);
  });
}

function login(user:Socket, data:Credentials) {
  const { username, password } = data;

  if (username && password) {
    sendTo(user, { type: "success", success: SocketSuccessType.Login, token: "Cake is a Lie" } as SuccessSocketMessage);
  } else {
    sendTo(user, {
      type: "error",
      error: "login",
      message: "Wrong credentials",
      code: -1,
    } as ErrorSocketMessage);
  }
}

function offer(user:Socket, message: SocketOfferMessage) {
  roomCheck(user, () => {
    const newMessage = { ...message, id: user.id };
    rooms[user.room].send(message.target, newMessage);
  });
}

function candidate(user:Socket, message:SocketCandidateMessage) {
  roomCheck(user, () => {
    const newMessage = { ...message, id: user.id };
    rooms[user.room].send(message.target, newMessage);
  });
}

function create(user:Socket, message: SocketCreateMessage) {
  if (rooms[message.room]) {
    // error
    sendTo(user, {
      type: "error",
      error: "room",
      message: "This room already exists",
      code: 1,
    } as ErrorSocketMessage);
  }

  rooms[message.room] = new Room(message.room, message.password);

  join(user, message as SocketJoinMessage);
  sendTo(user, { type: "success", success: SocketSuccessType.RoomCreate,  } as SuccessSocketMessage);
}

export default wss;
