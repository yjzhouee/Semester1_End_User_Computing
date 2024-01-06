//variables for visual. 
let cols;
let rows;
let size = 50;
let arrows = [];
let r = size / 2;
let xoff = 0;
let yoff = 0;
let zoff = 0;
let increment = 0.0005;


//variables for music;

let mySound;
let myFilter;
let counter;
let isStopped = true;


function preload() {
  mySound = loadSound('NASA.mp3');
}



function setup() {

  let c = createCanvas(windowWidth - 200, windowHeight / 2);
  c.parent('page6');
  c.position(100, 260);

  c.mousePressed(playMusic);
  c.mouseOver(cursorChange);

  cols = width / size;
  rows = height / size;
  angleMode(DEGREES);

  myFilter = new p5.BandPass();
  mySound.disconnect();
  mySound.connect(myFilter);

}

function playMusic() {

  if (isStopped == true) {
    mySound.play();
    isStopped = false;
  } else {
    mySound.stop();
    isStopped = true;
  }

}

function cursorChange() {
  cursor(HAND, mouseX, mouseY);

}


function draw() {
  background(0);

  fill(215, 255, 213);
  xoff = 0;
  for (let i = 0; i < cols; i++) {
    arrows[i] = [];
    yoff = 0;
    for (let j = 0; j < rows; j++) {
      let angle = map(noise(xoff, yoff, zoff), 0, 1, 0, 360);
      arrows[i][j] = createVector(cos(angle), sin(angle));
      let pt0 = createVector(size / 2 + i * size, size / 2 + j * size);
      let pt1 = createVector(r * arrows[i][j].x, r * arrows[i][j].y);
      rect(pt0.x + pt1.x, pt0.y + pt1.y, 200, 1);
      noStroke();
      yoff += mouseY * increment;
    }
    xoff += mouseX * increment;
    zoff += increment;
  }

  let myFreq = map(mouseX, 0, width, 400, 4000);
  myFilter.freq(myFreq);

}


