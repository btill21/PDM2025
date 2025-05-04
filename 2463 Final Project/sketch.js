// Game properties
let obstacles = [];
let randint;
let score = 0;
let lost = false;
let next = 0;
let speed = 8;
let lives = 3;
let highScore = 0;
let lastSpeedIncrease = 0;
let gameStarted = false;

// Sounds
let jumpSound;
let hurtSound;

// Arduino-related
let port;
let connectionButton;

// Sprites
let dinosaurRunning, dinosaurJumping, dinosaurHurt;
let obstacleSprite;

function preload() {
  dinosaurRunning = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Run_6.png');
  dinosaurJumping = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Jump_8.png');
  dinosaurHurt = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Hurt_4.png');
  obstacleSprite = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Rock2.png');
}

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

function soundSetup() {
  jumpSound = loadSound('Media/Sounds/cartoon-jump-6462.mp3');
  hurtSound = loadSound('Media/Sounds/retro-hurt-2-236675.mp3');
}

function keyPressed() {
  if (key === ' ') {
    dinosaur.jump();
    if (lost) resetSketch();
  }
}

function mousePressed() {
  if (!gameStarted) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
        mouseY > height * 3 / 4 - 25 && mouseY < height * 3 / 4 + 25) {
      gameStarted = true;
      resetSketch();
    }
  } else if (lost) {
    resetSketch();
  }
}

function resetSketch() {
  score = 0;
  lost = false;
  obstacles = [];
  next = 0;
  speed = 8;
  lastSpeedIncrease = 0;
  lives = 3;
  dinosaur = new Dinosaur();
  randint = int(random(50, 150));
  loop();

  if (port && port.opened()) {
    port.write("reset\n");
  }
}

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

function draw() {
  background(220);

  if (port && port.opened()) {
    let str = port.readUntil('\n');
    if (str) {
      str = str.trim();
      if (str === "jump") {
        dinosaur.jump();
      } else if (str.startsWith("volume:")) {
        let raw = Number(str.split(":")[1]);
        let normalized = map(raw, 0, 1023, 0, 1);
        setGameVolume(normalized);
      }
    }
  }

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (lost) {
    drawGameOverScreen();
    return;
  }

  if (score > lastSpeedIncrease && score % 7 === 0 && speed < 30) {
    speed += 0.5;
    lastSpeedIncrease = score;
  }

  displayScore();
  displayLives();

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.move();
    o.draw();

    if (o.x + o.width < 0) {
      obstacles.splice(i, 1);
      continue;
    }

    if (!o.hit && dinosaur.x > o.x + o.width && dinosaur.y + 50 <= o.y) {
      score += 1;
      o.hit = true;
    }

    if (dinosaur.hits(o) && !o.hit) {
      lives -= 1;
      o.hit = true;
      port.write("hit\n");

      dinosaur.currentAnimation = "hurt";
      dinosaur.hurtTimer = dinosaur.hurtDuration;

      if (hurtSound && hurtSound.isLoaded()) hurtSound.play();

      if (lives <= 0) {
        port.write("gameover\n");
        lost = true;
      }
    }
  }

  if (next === randint) {
    obstacles.push(new Obstacle(false));
    if (random(1) < 0.4) obstacles.push(new Obstacle(true));
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
  textSize(48);
  text("Welcome to Monster Run!", width / 2, height / 4);
  textSize(24);
  text("Goal is to jump over obstacles and survive!", width / 2, height / 2);
  text("Press 'Spacebar' to jump or use an Arduino button", width / 2, height / 2 + 40);
  fill(0, 255, 0);
  rect(width / 2 - 100, height * 3 / 4 - 25, 200, 50, 10);
  fill(0);
  text("Start Game", width / 2, height * 3 / 4);
}

function drawGameOverScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text("Game Over", width / 2, height / 2 - 40);
  textSize(24);
  text(`Highscore: ${highScore}`, width / 2, height / 2);
  text("Click to try again", width / 2, height / 2 + 40);
  noLoop();
}

function displayScore() {
  fill(0);
  textAlign(LEFT, TOP);
  textSize(24);
  text(`Score: ${score}`, 30, 30);
}

function displayLives() {
  let heartSpacing = 30;
  let heartsWidth = lives * heartSpacing;
  let startX = (width - heartsWidth) / 2;

  for (let i = 0; i < lives; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(startX + i * heartSpacing, 20, 20, 20);
  }
}

function setGameVolume(volume) {

  volume = constrain(volume, 0, 1);

  if (jumpSound && jumpSound.isLoaded()) {
    jumpSound.setVolume(volume);
  }
  if (hurtSound && hurtSound.isLoaded()) {
    hurtSound.setVolume(volume);
  }

  console.log(`Game volume set to: ${volume}`);
}