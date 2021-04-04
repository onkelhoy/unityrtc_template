import React from 'react';

import Home from 'pages/Home';
import Game from 'pages/Game';
import Lobby from 'pages/Lobby';

import Context from './context';
import { PageTypes, IContext } from './types';

export default function Router() {
  const [current, setCurrent] = React.useState(PageTypes.Home);
  const [loading, setLoading] = React.useState(false);

  const provides:IContext = {
    LoadPage: (target:PageTypes) => {
      setLoading(true);
      setCurrent(target);

      //TODO wait some time before loading = false ?
      setLoading(false);
    }
  }

  return (
    <Context.Provider value={provides}>
      <div className={['router', loading ? 'loading' : ''].join(' ')}>
        {current === PageTypes.Game && <Game />}
        {current === PageTypes.Lobby && <Lobby />}
        {current === PageTypes.Home && <Home />}
      </div>
    </Context.Provider>
  );
}