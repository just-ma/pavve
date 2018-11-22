import React from "react";
import P5Wrapper from "react-p5-wrapper";

var lines = [];       // all lines
var currentEvent, prevEvent;
var movement_x, movement_y, movement = 5; // base stroke width is 5
var drawing = false;
var changing = false;
var portal_x, portal_y;
var temp_portal_x, temp_portal_y;
var pc1, pc2, pc3;
var bc1, bc2, bc3;
var size = 45;

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

function translate_point( p, m ){
  return p + Math.pow(p - m,3)/1000;
}

function rand_color() {
  bc1 = pc1;
  bc2 = pc2;
  bc3 = pc3;
  var temp;
  switch (Math.floor(Math.random() * 3)){
    case 0:
      temp = pc1;
      pc1 = pc2;
      pc2 = temp;
      break;
    case 1:
      temp = pc1;
      pc1 = pc3;
      pc3 = temp;
      break;
    case 2:
      temp = pc2;
      pc2 = pc3;
      pc3 = temp;
      break;
    default:
      break;
  }
  if (pc1 !== 0 && pc1 !== 255){
    pc1 = Math.floor(Math.random() * 253) + 1;
  }
  if (pc2 !== 0 && pc2 !== 255){
    pc2 = Math.floor(Math.random() * 253) + 1;
  }
  if (pc3 !== 0 && pc3 !== 255){
    pc3 = Math.floor(Math.random() * 253) + 1;
  }
}

const sketch = p5 => {
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.stroke("#000000");
    portal_x = p5.windowWidth/2 - 25;
    portal_y = p5.windowHeight/2 - 25;
    pc1 = 100;
    pc2 = 0;
    pc3 = 255;
    bc1 = 255;
    bc2 = 100;
    bc3 = 100;
  };

	p5.draw = () => {
        p5.clear();
        if (p5.mouseX > portal_x && p5.mouseX < portal_x + 50 &&
            p5.mouseY > portal_y && p5.mouseY < portal_y + 50 && !changing){
          drawing = true;
          changing = true;
          temp_portal_x = portal_x;
          temp_portal_y = portal_y;
          size = 50;
        }
        
        //background
        p5.strokeWeight(0);
        console.log(.8/(Math.abs(portal_x - p5.mouseX) + 0.1));
        p5.fill(bc1, bc2, bc3, 50000/(Math.sqrt(Math.pow(portal_x - p5.mouseX,2) + 
                                                Math.pow(portal_y - p5.mouseY,2)) + 1));
        p5.rect(0, 0, p5.windowWidth, p5.windowWidth);

        if (!drawing){

          //first portal
          p5.fill(pc1, pc2, pc3, [1]);
          p5.rect(portal_x, portal_y, 50, 50);

        } else {

          // all strokes
          if (p5.mouseX !== 0 || p5.mouseX !== p5.pmouseX || p5.mouseY !== p5.pmouseY){      
            lines.push(new Line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY, movement));
          }
          for (var i = 0; i < lines.length; i++) {
            p5.strokeWeight(lines[i].weight);

            // if the mouse is close to a point of a line, the point will 
            // move be drawn close to the mouse

            p5.line(translate_point(lines[i].x, p5.mouseX), 
                    translate_point(lines[i].y, p5.mouseY),
                    translate_point(lines[i].px, p5.mouseX),
                    translate_point(lines[i].py, p5.mouseY));
          }

          //hidden portal
          p5.strokeWeight(0);
          p5.fill(pc1, pc2, pc3, [1]);
          if (changing){

            if (temp_portal_x > 0){
              temp_portal_x = Math.max(temp_portal_x - 45, 0);
            } 
            if (temp_portal_y > 0){
              temp_portal_y = Math.max(temp_portal_y - 45, 0);
            }
            if (size < p5.windowWidth){
            size+=100;
            } else {
              changing = false;
              portal_x = Math.floor(Math.random() * (p5.windowWidth - 120) + 60);
              portal_y = Math.floor(Math.random() * (p5.windowHeight - 120) + 60);
              rand_color();
              lines = [];
            }
            p5.rect(temp_portal_x,
            temp_portal_y, 
            size, 
            size);
          } else {
            p5.rect(translate_point(portal_x, p5.mouseX),
            translate_point(portal_y, p5.mouseY), 
            45 + Math.pow(portal_x - p5.mouseX,2)/50, 
            45 + Math.pow(portal_y - p5.mouseY,2)/50);
          }
        } 

        //mouse
        p5.noFill();
        p5.strokeWeight(movement);
        p5.ellipse(p5.mouseX, p5.mouseY, movement * 5, movement * 5);
			};	

  function Line(x, y, px, py, weight) {
    this.x = x;
    this.y = y;
    this.px = px;
    this.py = py;
    this.weight = weight;
  }
};

function Canvas(props) {
  return <P5Wrapper sketch={sketch} />;
}

export default Canvas;
