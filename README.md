# unityrtc-template

Simple yet elegant template solution for unity built on webGL to take use of the webRTC library. The template includes a typescript based web solution both with server to serve signaling but also the actual peer responsible for your online communication.

npm was used as a package manager for all web content.

## GAME

this is where you should put your own game

## WEB

triggers build for both client & server, copies common types for both (wanted a solution that involves one file but built takes it in - peerDependency does not work). Also moves /WEB/public into /product/public

### Server

uses express and ws to host the server on default port 8080, but can also add `.env` under /WEB
can easily be extended to

```
SERVER = <desired port number>
```

### Client

The most exiting as its direct linked with unity

Modiy your game so the following global commands points to yours (none are manditory but recomend _message_)

```
UNITY: {
  connectionUpdate: (id:string, state:RTCPeerConnectionState) => void;
  channelUpdate: (label:string, state:RTCPeerConnectionState) => void;
  message: (channel:string, peer_id:string, msg:string) => void;
  error: (type:string, peer_id:string, error:string) => void;
  disconnect: (peer_id:string) => void;
  hostChange: (host:string) => void;
  setID: (id:string) => void;
  socketError: (type:string, message:string) => void;
  answerError: (error:any) => void; // cant figure out what type error is, should check docs
},
```

unity can also talk to javascript, window has RTC on it with the public functions:

```
send: (to:string, message:string, channels:string|string[]) => boolean
broadcast: (message:string, channels:string|string[]) => void
terminateSocket: () => void
terminate: () => void
farwell: () => void
create: (room:string, password:string) => void
connect: (room:string, password:string) => void
```

# To use

Make sure your game is inside /GAME
Run the following commands

```
1. npm install
2. npm run buildstart
```
