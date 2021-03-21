import WebSocket from "ws";
// import redis from 'redis';

import { sendTo } from "../utils";
import { 
  SocketRequestCandidate, 
  SocketRequestOffer,
  SocketRequestAnswer,
  SocketRequestJoin,
  SocketRequestCreate,

  SocketMessage, 
  SocketMessageError, 
  SocketMessageCandidate, 
  SocketMessageAnswer,
  SocketMessageOffer,
  SocketTypes,
  SocketErrorType,
} from '../common';
import { 
  Socket, 
} from '../types';

import Room from "./room";

const rooms:{[key:string]: Room} = {};
const wss = new WebSocket.Server({ noServer: true });
// const redisClient = redis.createClient();

// redisClient.on('error', error => {
//   console.error('redis error', error);

//   console.log("tjabba tjena hallå");
// });

wss.on("connection", function (user:Socket) {
  user.on("message", onMessage.bind(user));
  user.on('close', onClose.bind(user));
});

function onMessage(this:Socket, message: string) {
  const data = JSON.parse(message) as SocketMessage;
  const user = this;

  switch (data.type) {
    case SocketTypes.Offer:
      return offer(user, data as SocketRequestOffer);
    case SocketTypes.Answer:
      return answer(user, data as SocketRequestAnswer);
    case SocketTypes.Candidate:
      return candidate(user, data as SocketRequestCandidate);
    case SocketTypes.Leave:
      return leave(user);
    case SocketTypes.Join:
      return join(user, data as SocketRequestJoin);
    case SocketTypes.Create: 
      return create(user, data as SocketRequestCreate);
    case SocketTypes.Farwell:
      return farwell(user);
    case SocketTypes.HeartBeat:
      return heartbeat(user);
  }
}

function onClose(this:Socket) {
  leave(this);
} 

function roomCheck(user:Socket, cb:Function) {
  const { room } = user;

  if (!!rooms[room]) cb();
  else {
    sendTo(user, {
      type: SocketTypes.Error,
      error: SocketErrorType.Room,
      message: "Room is not existing",
    } as SocketMessageError);
  }
}

function heartbeat(user:Socket) {
  user.heartbeat = Date.now();
}

function farwell(user:Socket) {
  roomCheck(user, () => {
    if (rooms[user.room].farwell(user)) {
      delete rooms[user.room];
      console.log('room deleted', user.room);
    } 
  });
}

function join(user:Socket, message:SocketRequestJoin) {
  if (rooms[message.room]) {
    rooms[message.room].join(user, message.password);
  } else {
    sendTo(user, {
      type: SocketTypes.Error,
      error: SocketErrorType.Room,
      message: "Room is not existing",
    } as SocketMessageError);
  }
}

function answer(user:Socket, message: SocketRequestAnswer) {
  roomCheck(user, () => {
    const newMessage:SocketMessageAnswer = { type: SocketTypes.Answer, from: message.from, answer: message.answer };
    rooms[user.room].send(message.to, newMessage);
  });
}

function leave(user:Socket) {
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

function offer(user:Socket, message: SocketRequestOffer) {
  roomCheck(user, () => {
    const newMessage:SocketMessageOffer = { type: SocketTypes.Offer, from: message.from, offer: message.offer };
    rooms[user.room].send(message.to, newMessage);
  });
}

function candidate(user:Socket, message:SocketRequestCandidate) {
  roomCheck(user, () => {
    const newMessage:SocketMessageCandidate = { type: SocketTypes.Candidate, from: message.from, candidate: message.candidate };
    rooms[user.room].send(message.to, newMessage);
  });
}

function create(user:Socket, message: SocketRequestCreate) {
  if (rooms[message.room]) {
    // error
    sendTo(user, {
      type: SocketTypes.Error,
      error: SocketErrorType.Room,
      message: "This room already exists",
    } as SocketMessageError);
  }

  rooms[message.room] = new Room(message.room, message.password);

  join(user, message as SocketRequestJoin);
}

export default wss;
