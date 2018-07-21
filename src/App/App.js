import React, { Component } from 'react';
import Example from './Example';
import Pusher from './Pusher';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';

const RedirectWithStatus = ({ from, to, status }) => (
  <Route
    render={({ staticContext }) => {
      // there is no `staticContext` on the client, so
      // we need to guard against that here
      if (staticContext) {
        staticContext.status = status;
      }
      return <Redirect exactly={from} to={to} />;
    }}
  />
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Universal App</h1>
          {this.props.fetchStatus === 1 ? (
            <img src="logo.svg" className="App-logo" alt="logo" />
          ) : (
            <div />
          )}
        </header>

        <Switch>
          <RedirectWithStatus from={'/someNewPage'} to={'/someOtherPage'} status={301} />
          <Route exact path="/" component={Pusher} />
          <Route path="/someOtherPage" component={Example} />
        </Switch>

        <div className="App-intro" />
      </div>
    );
  }
}

export default App;
