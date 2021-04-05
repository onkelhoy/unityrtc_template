import React from 'react';
import { Context } from 'components/RTCS';
import { PeerMessageType } from 'components/RTCS/types';

function Lobby() {
  const { peers, username, host, id, SystemBroadcast } = React.useContext(Context);
  function start() {
    console.log('start is pressed', 'call')
    if (id === host) {
      SystemBroadcast({ type: PeerMessageType.start });
    }
  }
  
  return (
    <div className="flex-center lobby">
      <h1 className="text-center">Lobby <span id="roomName">ROOM</span></h1>
      <span id="lobbyerror" className="error"></span>

      <ul id="peers">
        <li className={['me', id === host ? 'host' : ''].join(' ')}>{username}</li>
        {peers.map(p => <li className={p.id === host ? 'host' : ''} key={p.id}>{p.username}</li>)}
      </ul>
      <div className="start"><button id="start" onClick={start} disabled={id !== host}>Start Game</button></div>
    </div>
  );
}

export default Lobby;
