let obstacles;
let randint;
let score;
let lost;
let next;
let spread;
let speed; 
let lives; 
let highScore = 0;


let dinosaurSprite, dinosaurRunning, dinosaurJumping;
let obstacleSprite, obstacleAnimation;

function preload() {
  dinosaurRunning = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Run_6.png');
  dinosaurJumping = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Jump_8.png');
  dinosaurHurt = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Owlet_Monster_Hurt_4.png');
  obstacleSprite = loadImage('Media/craftpix-net-622999-free-pixel-art-tiny-hero-sprites/2 Owlet_Monster/Rock2.png');
}

function setup() {
  createCanvas(1200, 600); 
  textSize(24);
  resetSketch();
}

function keyPressed() {
  if (key == 'v') {
    dinosaur.jump();
    if (lost) {
      resetSketch();
    }
  }
}

function mousePressed() {
  if (lost) {
    resetSketch();
  }
}

function resetSketch() {

  console.log("Restarting game");
  score = 0;
  lost = false;
  obstacles = [];
  next = 0;
  speed = 6; 
  lives = 3; 
  dinosaur = new Dinosaur();
  new Obstacle();
  randint = int(random(50, 150));
  loop();
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


  speed += 0.05;

  
  fill(0);
  textAlign(LEFT, TOP);
  textSize(24);
  text(`Score: ${score}`, 30, 30);

  let heartSpacing = 30;
  let heartsWidth = lives * heartSpacing;
  let startX = (width - heartsWidth) / 2;

  for (let i = 0; i < lives; i++) {
    fill(255, 0, 0); 
    noStroke();
    ellipse(startX + i * heartSpacing, 20, 20, 20); 
  }

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
      console.log("Hit obstacle!");
      lives -= 1;
      o.hit = true;

      dinosaur.currentAnimation = "hurt";
      dinosaur.hurtTimer = dinosaur.hurtDuration;

      if (lives <= 0) {
        console.log("Game Over!");
        lost = true;
      }
    }
  }

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