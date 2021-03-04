import { Socket } from "./types";
import { SocketMessage } from "common/types";

export function sendTo (socket: Socket, message: SocketMessage) {
  const strmessage = JSON.stringify(message);
  socket.send(strmessage);
};
