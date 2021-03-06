# unityrtc-template

Simple yet elegant template solution for unity built on webGL to take use of the webRTC library. The template includes a typescript based web solution both with server to both serve your game together with a webrtc peer solution plus act as an signaling server.

your game will end up under `/project` together with server that will not only serve your game but also give you free multiplayer.

npm was used as a package manager for all web content.

# To use

Make sure your game is inside /GAME

Run the following commands
(_think it should be possible to have all dependancies inside root, but had some problems.._)

```
1. cd WEB/client
2. npm install
3. cd ../server
4. npm install
5. cd ../..                # root
6. npm install             # to install production required deps: (express, ws)
7. npm run buildstart
```

## /GAME

Game must have built option _"webGL"_

To get all files you'll need run first `npm run prepare` \
which will copy all necessary files into your game

It will also push a template to be used by your build settings under the \
`player settings`, locate and select _RTC_ in _Resolution and Presentation_

When you build make sure to dump it into `/GAME/build` and now run `npm run prelease` to have your game under the product folder (which is your whole thing, should be fairly small)

Game includes a simple menu that showcases how the RTC api works, and a super small click game just for testing purposes!

## /WEB

triggers build for both client & server, copies common types for both (wanted a solution that involves one file but built takes it in - peerDependency does not work). Also moves /WEB/public into /product/public

### /WEB/Server

uses express and ws to host the server on default port 8080, but can also add `.env` under /WEB
can easily be extended to

```
SERVER = <desired port number>
```

### /WEB/Client

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
