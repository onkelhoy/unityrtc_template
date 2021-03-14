import { Socket } from "./types";
import { SocketMessage, SocketTypes } from "./common.types";

export function sendTo (socket: Socket, message: SocketMessage) {
  const strmessage = JSON.stringify(message);
  socket.send(strmessage);

  if (message.type === SocketTypes.Farwell) {
    if (socket) socket.close();
  }
};
