import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";

var lines = [];       // all lines
var line_count = [];  // stores number of lines for every stroke
let temp_line = [];		// stores last 'undo' line
var lc = 0;           // line count for current stroke
var sc = 0;           // stroke count
var currentEvent, prevEvent;
var movement_x, movement_y, movement = 5; // base stroke width is 5
var mu = false;       //mouse up

document.documentElement.onmousemove=function(event){
  currentEvent = event;
}

setInterval(function(){
  if (currentEvent && prevEvent){
    movement_x = Math.abs(currentEvent.screenX - prevEvent.screenX);
    movement_y = Math.abs(currentEvent.screenY - prevEvent.screenY);
    movement = (movement*10 + 5 + Math.sqrt(Math.pow(movement_x,2) + Math.pow(movement_y,2)))/11.;
    // movement is the "smoothed" velocity of the mouse (takes average of 10 * past velocity and current velocity)
    // determines thickness of stroke
  }
  prevEvent = currentEvent;
},5);

const sketch = p5 => {
  let curr_color;

  const color_options = {
    scheme_1: ["#94EBD8", "#00B349"],
    scheme_2: ["#983275", "#FF6F01"],
    scheme_3: ["#C3A706", "#329290"]
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    curr_color = p5.color("#000000");
    p5.noFill();
  };

	p5.draw = () => {
        p5.clear();
        //p5.line(p5.mouseX,p5.mouseY,
        //        p5.mouseX + 30 + p5.mouseX/10,
        //        p5.mouseY - 30 - p5.mouseY/10);
        p5.ellipse(p5.mouseX, p5.mouseY, movement * 5, movement * 5);
        if (p5.mouseX != 0 || p5.mouseX != p5.pmouseX || p5.mouseY != p5.pmouseY){      
          lines.push(new Line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY, movement,curr_color));
        }
				for (var i = 0; i < lines.length; i++) {
					p5.strokeWeight(lines[i].weight);
		      p5.stroke(lines[i].color);

					// if the mouse is close to a point of a line, the point will 
					// move be drawn close to the mouse

		      p5.line(lines[i].x + Math.pow(lines[i].x - p5.mouseX,3)/1000, 
		                lines[i].y + Math.pow(lines[i].y - p5.mouseY,3)/1000, 
		               lines[i].px +  Math.pow(lines[i].px - p5.mouseX,3)/1000, 
		                lines[i].py + Math.pow(lines[i].py - p5.mouseY,3)/1000);
				  }
			};
	/*	

  p5.mousePressed = () => {
		movement_x = 5;
		movement_y = 5;
		movement = 5;
    mu = false;
    lc = 0;
  };

  p5.mouseDragged = () => {
    lines.push(new Line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY, 5,curr_color));
    lc++;
  };

  
  p5.mouseReleased = () => {
    line_count[sc] = lc;
    sc++;
    mu = true;
  };
*/
  p5.keyPressed = () => {
    switch (p5.key) {
      case "R":
      case "r":
				lines = [];       // all lines
        line_count = [];  // stores number of lines for every stroke
				temp_line = [];		// stores last 'undo' line
				lc = 0;           // line count for current stroke
				sc = 0;           // stroke count
				p5.clear();
        curr_color = p5.color("#000000");
        break;
      case "T":
        curr_color = p5.color(color_options.scheme_1[0]);
        break;
      case "G":
        curr_color = p5.color(color_options.scheme_1[1]);
        break;
      case "Y":
        curr_color = p5.color(color_options.scheme_2[0]);
        break;
      case "H":
        curr_color = p5.color(color_options.scheme_2[1]);
        break;
      case "U":
        curr_color = p5.color(color_options.scheme_3[0]);
        break;
      case "J":
        curr_color = p5.color(color_options.scheme_3[1]);
        break;
       default:
       	break;
    }
    

    if (p5.key === "D" || p5.key === "d") {
      if (lines.length > 0 && mu){
      	  //add deleted lines to deleted_lines array
      	  temp_line = lines.slice(lines.length - line_count[sc-1], lines.length);	//store last stroke in temp array
          lines.splice(lines.length - line_count[sc-1], line_count[sc-1]); //remove Drawing from array
          sc--;
          p5.clear();
      }
    }

    if (p5.key === "Q" || p5.key === "q") {
    	if (mu){
    		lines = lines.concat(temp_line);	//add line back to lines array
    		sc++;
    	}
    }
  };

  function Line(x, y, px, py, weight, color) {
    this.x = x;
    this.y = y;
    this.px = px;
    this.py = py;
    this.weight = weight;
    this.color = color;
  }
};

function Canvas(props) {
  return <P5Wrapper sketch={sketch} />;
}

export default Canvas;
