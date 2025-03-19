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
  let prevX, prevY; 

  function setup() {
    createCanvas(1920, 1200);
    background(255);
    drawPalette();
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
      }
    }
  }
  
  function draw() {
    if (mouseIsPressed) {
      stroke(selectedColor);
      strokeWeight(4);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  
  
 
    drawPalette();

  }
  
