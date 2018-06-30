import React, { Component } from 'react';
import Example from './Example'
import './App.css';

class App extends Component {

  onClick(props) {
      props.updateMessage({some: "data"}, ()=>{});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Universal App</h1>
          {
            this.props.fetchStatus === 1 ?
              <img src="logo.svg" className="App-logo" alt="logo"/>
              :
              <div />
          }
        </header>
        <div className="App-intro">

          <button onClick={()=>this.onClick(this.props)}>BEGIN</button>

          <Example />

        </div>
      </div>
    );
  }
}


export default App;