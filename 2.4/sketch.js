let colors = [
  { name: "red", value: [255, 0, 0] },
  { name: "orange", value: [255, 165, 0] },
  { name: "yellow", value: [255, 255, 0] },
  { name: "green", value: [0, 255, 0] },
  { name: "light blue", value: [0, 255, 255] },
  { name: "blue", value: [0, 0, 255] },
  { name: "pink", value: [255, 0, 255] },
  { name: "brown", value: [165, 42, 42] },
  { name: "white", value: [255, 255, 255] },
  { name: "black", value: [0, 0, 0] }
];

let selectedColor = [0, 0, 0]; 
let paletteWidth = 30; 
let colorChangeSound, drawSound, clearSound;
let clearButton;

function preload() {
  colorChangeSound = loadSound('media/bass-4-296245.mp3');
  drawSound = loadSound('media/colouringclose-33150.mp3');
  clearSound = loadSound('media/dream-track-mix-28763.mp3'); 
}

function setup() {
  createCanvas(1920, 1200);
  background(255);
  drawPalette();
  

  clearButton = createButton('Clear Screen');
  clearButton.position(paletteWidth + 10, 10);
  clearButton.mousePressed(clearScreen);
}

function drawPalette() {
  let gap = 17;    
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i].value);
    noStroke();
    rect(0, i * (25 + gap), paletteWidth, 40);
  }
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    let index = floor(mouseY / 40);
    if (index >= 0 && index < colors.length) {
      selectedColor = colors[index].value;
      let playbackRate = map(index, 0, colors.length - 1, 0.5, 2); 
      colorChangeSound.rate(playbackRate);
      colorChangeSound.play();
    }
  }
}

function draw() {
  if (mouseIsPressed && mouseX > paletteWidth) {
    stroke(selectedColor);
    strokeWeight(4);
    line(pmouseX, pmouseY, mouseX, mouseY);
    if (!drawSound.isPlaying()) {
      drawSound.play();
    }
  } else {
    drawSound.stop(); 
  }

  drawPalette();
}

function clearScreen() {
  background(255);
  drawPalette();
  clearSound.play();
  setTimeout(() => clearSound.stop(), 5000); 
}
