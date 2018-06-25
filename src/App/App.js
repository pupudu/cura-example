import React, { Component } from 'react';
import {Route, Switch} from 'react-router';
import Example from './Example'
import './App.css';

class App extends Component {
  componentDidMount() {
    if(!this.props.message) {
      setTimeout(()=>{
        this.props.updateMessage("Hi, I'm from client!");
      }, 5000);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="logo.svg" className="App-logo" alt="logo"/>
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Example />
          <p>
            Redux: { this.props.message }
            <Switch>
              <Route path="/d" render={() => (<div>Match</div>)} />
              <Route render={() => (<div>Miss</div>)} />
            </Switch>
          </p>
        </div>
      </div>
    );
  }
}


export default App;