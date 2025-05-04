// game properties
let obstacles;        // Array to store all obstacles
let randint;          // Random interval for obstacle spawning
let score;            // Current game score
let lost;             // Game over state
let next;             // Counter for obstacle spawning
let spread;           // Spacing between obstacles
let speed;            // Current game speed
let lives;            // Number of remaining lives
let highScore = 0;    // Highest score achieved
let jumpSound;        // Sound effect for jumping
let hurtSound;        // Sound effect for getting hurt
let lastSpeedIncrease = 0; // Tracks when speed was last increased
let gameStarted = false;   // New state to track if game has started
let jumpPressed = false;


let port; // arduino
let connectionButton; // Button to connect to Arduino
// sprites
let dinosaurSprite, dinosaurRunning, dinosaurJumping;
let obstacleSprite, obstacleAnimation;

let sampler;
let backgroundMusic;



function preload() {
  dinosaurRunning = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Run_6.png');
  dinosaurJumping = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Jump_8.png');
  dinosaurHurt = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Hurt_4.png');
  obstacleSprite = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Rock2.png');
}

/**
 * Game Initialization
 */
function setup() {

  createCanvas(1200, 600); 
  textSize(24);
  soundSetup();
  resetSketch();

  port = createSerial();
  connectionButton = createButton('Connect to Arduino');
  connectionButton.mousePressed(connect);
  

}

function connect() {
  port.open('Arduino', 9600);
}

/**
 * Game sound setup
 */
function soundSetup(){
  console.log("Starting sound setup...");
  
  jumpSound = loadSound('Media/Sounds/cartoon-jump-6462.mp3', 
    function() {
      console.log('Jump sound loaded successfully');
    },
    function(error) {
      console.error('Error loading jump sound:', error);
    }
  );
  
  hurtSound = loadSound('Media/Sounds/retro-hurt-2-236675.mp3',
    function() {
      console.log('Hurt sound loaded successfully');
    },
    function(error) {
      console.error('Error loading hurt sound:', error);
    }
  );
console.log(Tone.context.state);

}

/**
 * keyboard input, jumping using v
 */
function keyPressed() {
  if (key == 'v') {
    dinosaur.jump();
    if (lost) {
      resetSketch();
    }
  }
}

function mousePressed() {
  if (!gameStarted) {
    // Check if start button was clicked
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height * 3/4 - 25 && mouseY < height * 3/4 + 25) {
      gameStarted = true;
      resetSketch();
    }
  } else if (lost) {
    resetSketch();
  }
}

/**
 * Resetting game to original state
 */
function resetSketch() {
  console.log("Restarting game");
  score = 0;
  lost = false;
  obstacles = [];
  next = 0;
  speed = 8; 
  lastSpeedIncrease = 0;
  lives = 3; 
  dinosaur = new Dinosaur();
  new Obstacle();
  randint = int(random(50, 150));
  
  

  
  loop();
  if (port && port.opened()) {
    port.write("reset\n"); // Send reset signal to Arduino
  }
}



/**
 * Handles sprites and their animations
 */
class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration, singleFrame = false) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.framecount = 0;
    this.scaleFactor = 2;
    this.singleFrame = singleFrame;
  }

  draw(x, y, flip = false) {
    let spriteSize = 32; 
    let displaySize = spriteSize * this.scaleFactor;

    if (flip) {
      push();
      scale(-1, 1);
      image(this.spritesheet, -x - displaySize, y, displaySize, displaySize, this.u * spriteSize, this.v * spriteSize, spriteSize, spriteSize);
      pop();
    } else {
      image(this.spritesheet, x, y, displaySize, displaySize, this.u * spriteSize, this.v * spriteSize, spriteSize, spriteSize);
    }

    if (!this.singleFrame) {
      this.framecount++;
      if (this.framecount % 8 === 0) this.u++;
      if (this.u >= this.startU + this.duration) this.u = this.startU;
    }
  }
}

/**
 * Main game loop

 */
function draw() {
  background(220);

  if (port && port.opened()) {
    let str = port.readUntil('\n');
    if (str) {
      str = str.trim();
      if (str === "jump"){
        dinosaur.jump();
      }
      }
    }



  // Start screen
  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  // Game over screen
  if (lost) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("Game Over", width / 2, height / 2 - 40);
    textSize(24);
    text(`Highscore: ${highScore}`, width / 2, height / 2);
    text("Click to try again", width / 2, height / 2 + 40);
    noLoop();
    return;
  }

  // Speed increase logic - increases every 7 points up to speed 25
  if (score > lastSpeedIncrease && score % 7 === 0 && speed < 25) {
    speed += 0.5;
    lastSpeedIncrease = score;
    console.log("Speed increased to:", speed);
  }

  // Display current score
  fill(0);
  textAlign(LEFT, TOP);
  textSize(24);
  text(`Score: ${score}`, 30, 30);

  // Display lives as hearts
  let heartSpacing = 30;
  let heartsWidth = lives * heartSpacing;
  let startX = (width - heartsWidth) / 2;

  for (let i = 0; i < lives; i++) {
    fill(255, 0, 0); 
    noStroke();
    ellipse(startX + i * heartSpacing, 20, 20, 20); 
  }

  // Obstacle management and collision detection
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.move();
    o.draw();

    if (o.x + o.width < 0) {
      obstacles.splice(i, 1);
      continue;
    }

    // Check if dinosaur has passed obstacle and increment score
    // Only increment if obstacle hasn't been hit yet and dinosaur has cleared the obstacle height
    if (!o.hit && dinosaur.x > o.x + o.width && dinosaur.y + 50 <= o.y) {
      score += 1;
      o.hit = true;
    }
   
    if (!o.hit && dinosaur.x > o.x + o.width) {
      score += 1;
      o.hit = true;
    }

    if (dinosaur.hits(o) && !o.hit) {
      console.log("Hit obstacle!");
      lives -= 1;
      o.hit = true;

      port.write("hit\n"); // Send hit signal to Arduino

      dinosaur.currentAnimation = "hurt";
      dinosaur.hurtTimer = dinosaur.hurtDuration;

      // hurt sound effect
      if (hurtSound && hurtSound.isLoaded()) {
        console.log("Playing hurt sound");
        hurtSound.play();
      } else {
        console.log("Hurt sound not ready");
      }

      if (lives <= 0) {
        console.log("Game Over!");
        port.write("gameover\n"); // Send game over signal to Arduino
        lost = true;
      }
    }
  }

  // Obstacle spawning
  if (next === randint) {
    let groundObstacle = new Obstacle(false); 
    obstacles.push(groundObstacle);

    if (random(1) < 0.4) {
      let airborneObstacle = new Obstacle(true); 
      obstacles.push(airborneObstacle);
    }

    next = 0;
    randint = int(random(50, 150)); 
  }

  next++;

  dinosaur.move();
  dinosaur.draw();

 
}

function drawStartScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  
  // Title
  textSize(48);
  text("Welcome to Monster Run!", width / 2, height / 4);
  
  // Instructions
  textSize(24);
  text("Objective:", width / 2, height / 2 - 40);
  text("Jump over obstacles and survive as long as possible!", width / 2, height / 2);
  text("Press 'V' to jump or use Arduino button", width / 2, height / 2 + 40);
  
  // Start button
  fill(0, 255, 0);
  rect(width / 2 - 100, height * 3/4 - 25, 200, 50, 10);
  fill(0);
  textSize(24);
  text("Start Game", width / 2, height * 3/4);
}

