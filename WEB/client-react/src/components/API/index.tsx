import React from "react";
import Loading from 'components/Loading';

import Context from './context';

interface IState {
  loading:Boolean;
}

class API extends React.Component {
  state:IState = {
    loading: false,
  };

  async Call(input:RequestInfo, init:RequestInit) {
    this.setState({ Loading: true });
    let ret = null;
    try {
      const res:Response = await fetch(input, init);
      ret = res.json();
    }
    catch (error) {
      ret = { error };
    }

    this.setState({ Loading: false });
    return ret;
  }

  render() {
    if (this.state.loading) {
      return <Loading screen />
    }
    
    return (
      <Context.Provider value={{ Call: this.Call }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}


export default API;