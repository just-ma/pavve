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
        <div class = "Canvas">
        <Canvas id="myCanvas" ></Canvas>
        </div>
      </div>
    );
  }
}

export default App;
