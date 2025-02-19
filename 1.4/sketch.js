let GameStates = Object.freeze({
  Start: "start",
  Play: "play",
  End: "end"
});

let gameState = GameStates.Start;
let Score = 0;
let Time = 10;
let textPadding = 10;
let spelunker;
let spelunkerSquished;
let spelunkers = [];
let numSpelunkers = 5;
let canvasWidth = 800;
let canvasHeight = 600;
let bugSpeed = 1;

function preload() {
  spelunker = loadImage("media/BeetleMove.png");
  spelunkerSquished = loadImage("media/squished.png");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  for (let i = 0; i < numSpelunkers; i++) {
    let x = random(80, canvasWidth - 80);
    let y = random(80, canvasHeight - 80);
    let spel = new Character(x, y);
    spel.addAnimation("right", new SpriteAnimation(spelunker, 12, 3, 4)); // 2nd row
    spel.addAnimation("left", new SpriteAnimation(spelunker, 0, 2, 4));  // 3rd row
    spel.addAnimation("up", new SpriteAnimation(spelunker, 0, 3, 4));    // 4th row
    spel.addAnimation("down", new SpriteAnimation(spelunker, 0, 0, 4));  // 1st row

    spel.addAnimation("downSquished", new SpriteAnimation(spelunkerSquished, 0, 0, 4, true)); 
    spel.addAnimation("upSquished", new SpriteAnimation(spelunkerSquished,0, 0, 4, true)); 
    spel.addAnimation("leftSquished", new SpriteAnimation(spelunkerSquished,0, 0, 4, true)); 
    spel.addAnimation("rightSquished", new SpriteAnimation(spelunkerSquished,  0, 0, 4, true)); 

    spel.currentAnimation = "idle";
    spelunkers.push(spel);
  }
}

function draw() {
  background(220);

  switch (gameState) {
    case GameStates.Start:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press Enter to start", width / 2, height / 2);
      break;

    case GameStates.Play:
      Time -= deltaTime / 1000;
      textAlign(LEFT, TOP);
      text("Score: " + Score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(Time), width - textPadding, textPadding);


      for (let i = spelunkers.length - 1; i >= 0; i--) {
        let spel = spelunkers[i];

        if (spel.squished) {

          if (millis() - spel.squishTime > 500) {
            spelunkers.splice(i, 1); 
            spawnNewBug(); 
          }
        } else {
          spel.move();
          spel.draw();
        }
      }

      if (Time <= 0) {
        gameState = GameStates.End;
      }
      break;

    case GameStates.End:
      textAlign(CENTER, CENTER);
      textSize(18);
      if (Score < 50) {
      text("Yikes, couldnt kill 50. Get Gud.", width / 2, height / 2);
        }
        else {
          text("Not bad. Go again.", width / 2, height / 2);
        }
      text("Score: " + Score, width / 2, height / 2 + 20);
      text("Press Enter to restart", width / 2, height / 2 + 40);
      break;
  }
}

function mousePressed() {
  if (gameState === GameStates.Play) {
    for (let i = 0; i < spelunkers.length; i++) {
      let spel = spelunkers[i];
      if (!spel.squished && spel.isClicked(mouseX, mouseY)) {
        Score++;
        spel.squished = true;
        spel.squishTime = millis(); 
        spel.currentAnimation = spel.currentAnimation.replace('down', 'downSquished')
                                                     .replace('up', 'upSquished')
                                                     .replace('left', 'leftSquished')
                                                     .replace('right', 'rightSquished');
        bugSpeed += 0.2;
        break;
      }
    }
  }
}


function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === GameStates.Start || gameState === GameStates.End) {
      gameState = GameStates.Play;
      Score = 0;
      Time = 30;
      bugSpeed = 1;
    }
  }
}

function spawnNewBug() {
  let x = random(80, canvasWidth - 80);
  let y = random(80, canvasHeight - 80);
  let spel = new Character(x, y);

  spel.addAnimation("right", new SpriteAnimation(spelunker, 12, 3, 4));
  spel.addAnimation("left", new SpriteAnimation(spelunker, 0, 2, 4));
  spel.addAnimation("up", new SpriteAnimation(spelunker, 0, 3, 4));
  spel.addAnimation("down", new SpriteAnimation(spelunker, 0, 0, 4));

  spel.addAnimation("downSquished", new SpriteAnimation(spelunkerSquished, 10, 1, 1, true));
  spel.addAnimation("upSquished", new SpriteAnimation(spelunkerSquished, 10, 1, 1, true));
  spel.addAnimation("leftSquished", new SpriteAnimation(spelunkerSquished, 10, 1, 1, true));
  spel.addAnimation("rightSquished", new SpriteAnimation(spelunkerSquished, 10, 1, 1, true));

  spel.currentAnimation = "idle";
  spelunkers.push(spel);
}


class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
    this.width = 64;
    this.height = 64;
    this.squished = false;
    this.changeDirection();
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  changeDirection() {
    if (this.squished) return; 
    let directions = ["right", "left", "up", "down"];
    this.currentAnimation = random(directions);
    setTimeout(() => this.changeDirection(), random(1000, 3000));
  }

  move() {
    if (gameState !== GameStates.Play || this.squished) return; 
    
    switch (this.currentAnimation) {
      case "right":
        if (this.x + bugSpeed < canvasWidth - 80) this.x += bugSpeed;
        else this.currentAnimation = "left";
        break;
      case "left":
        if (this.x - bugSpeed > 0) this.x -= bugSpeed;
        else this.currentAnimation = "right";
        break;
      case "up":
        if (this.y - bugSpeed > 0) this.y -= bugSpeed;
        else this.currentAnimation = "down";
        break;
      case "down":
        if (this.y + bugSpeed < canvasHeight - 80) this.y += bugSpeed;
        else this.currentAnimation = "up";
        break;
    }
  }

  draw() {
    if (gameState !== GameStates.Play) return;
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      push();
      translate(this.x, this.y);
      if (this.currentAnimation === "left") animation.draw(true);
      else animation.draw();
      pop();
    }
  }

  isClicked(mx, my) {
    return mx > this.x && mx < this.x + this.width && my > this.y && my < this.y + this.height;
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

  draw(flip = false) {
    let spriteSize = 32;
    let displaySize = spriteSize * this.scaleFactor;
    
    if (flip) {
      push();
      scale(-1, 1);
      image(this.spritesheet, -displaySize, 0, displaySize, displaySize, this.u * spriteSize, this.v * spriteSize, spriteSize, spriteSize);
      pop();
    } else {
      image(this.spritesheet, 0, 0, displaySize, displaySize, this.u * spriteSize, this.v * spriteSize, spriteSize, spriteSize);
    }

    if (!this.singleFrame) { 
      this.framecount++;
      if (this.framecount % 8 === 0) this.u++;
      if (this.u >= this.startU + this.duration) this.u = this.startU;
    }
  }
}
