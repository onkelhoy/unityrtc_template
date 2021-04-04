import React from 'react';

function Lobby() {
  function start() {

  }
  
  return (
    <div className="flex-center lobby">
      <h1 className="text-center">Lobby <span id="roomName">ROOM</span></h1>
      <span id="lobbyerror" className="error"></span>

      <ul id="peers">
        <li className="you">YOU</li>
      </ul>
      <div className="start"><button id="start" onClick={start} disabled>Start Game</button></div>
    </div>
  );
}

export default Lobby;
