import { ISocket } from "socket/types";
import { ISocketMessage, SocketMessageType } from "types.global";

export function sendTo (socket: ISocket, message: ISocketMessage) {
  const strmessage = JSON.stringify(message);
  socket.send(strmessage);

  if (message.type === SocketMessageType.Farwell) {
    if (socket) socket.close();
  }
};
