import React, { Component } from 'react';
import Canvas from "./canvas";
import './App.css';

class App extends Component {
  render() {
    return (
      <div class="dotcursor">
        <div className="App-logo">
          <h1>Welcome to Hell</h1>
        </div>
        <div class = "Canvas">
        <Canvas id="myCanvas" ></Canvas>
        </div>
      </div>
    );
  }
}

export default App;
