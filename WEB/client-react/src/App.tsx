import React from 'react';

import API from 'components/API';
import RTCS from 'components/RTCS';
import Router from 'components/Router';

import 'components/Unity';


export default class App extends React.Component {

  render () {

    return (
      <API>
        <RTCS>
          <Router />
        </RTCS>
      </API>  
    )
  }
};