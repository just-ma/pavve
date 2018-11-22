import React, { Component } from 'react';
import Canvas from "./canvas";
import './App.css';

function preventBehavior(e) {
  e.preventDefault(); 
};

document.addEventListener("touchmove", preventBehavior, {passive: false});

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
