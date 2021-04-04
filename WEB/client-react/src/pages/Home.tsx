import React from 'react';

import { Context } from 'components/RTCS';

function Home() {
  const roomREF = React.useRef<HTMLInputElement>(null);
  const passREF = React.useRef<HTMLInputElement>(null);
  const usrnREF = React.useRef<HTMLInputElement>(null);

  const { Join } = React.useContext(Context);

  function join() {
    if (!(roomREF.current && passREF.current && usrnREF.current)) 
      return;
    
    const { value:room } = roomREF.current;
    const { value:password } = passREF.current;
    const { value:username } = usrnREF.current;

    Join(room, username, password === '' ? undefined : password)
  }

  return (
    <div className="flex-center home">
      <h1 className="text-center">UnityRTC Template</h1>
      <span id="mainerror" className="error"></span>

      <fieldset className="field">
        <label htmlFor="room">Room*</label>
        <input ref={roomREF} id="room" name="room" type="text" placeholder="Example Name" />
      </fieldset>
      <fieldset className="field">
        <label htmlFor="password">Password</label>
        <input ref={passREF} id="password" name="password" type="password" placeholder="Optional Password" />
      </fieldset>
      <fieldset className="field">
        <label htmlFor="username">Join As</label>
        <input ref={usrnREF} id="username" name="username" type="text" value="Bob Lazar" />
      </fieldset>
      <fieldset className="field connect">
        <button onClick={join}>Join</button>
      </fieldset>
    </div>
  );
}

export default Home;
