let spelunker;
let chick;

function preload() {
  spelunker = loadImage("media/spelunker.png");
  chick = loadImage("media/greenchick.png");
  meaty = loadImage("media/meaty.png");
}

function setup() {
  createCanvas(400, 400);

  character = new Character(random(80, width - 80), random(80, height - 80));
  character.addAnimation("right", new SpriteAnimation(spelunker, 0, 0, 9)); //1st row
  character.addAnimation("left", new SpriteAnimation(spelunker, 0, 0, 4)); // scale this so left is facing left
  character.addAnimation("up", new SpriteAnimation(spelunker, 0, 5, 4)); //1st column 5th row
  character.addAnimation("down", new SpriteAnimation(spelunker, 7, 5, 4)); //7th column 5th row
  character.addAnimation("idle", new SpriteAnimation(spelunker, 0, 0, 0)); //adjust this one later
  character.currentAnimation = "idle";

  chick1 = new Character(random(80, width - 80), random(80, height - 80));
  chick1.addAnimation("right", new SpriteAnimation(chick, 0, 0, 4)); //1st row
  chick1.addAnimation("left", new SpriteAnimation(chick, 0, 0, 4)); // scale this so left is facing left
  chick1.addAnimation("up", new SpriteAnimation(chick, 0, 5, 4)); //1st column 5th row
  chick1.addAnimation("down", new SpriteAnimation(chick, 7, 5, 4)); //7th column 5th row
  chick1.addAnimation("idle", new SpriteAnimation(chick, 0, 0, 0)); //adjust this one later
  chick1.currentAnimation = "idle";

  character3 = new Character(random(80, width - 80), random(80, height - 80));
  character3.addAnimation("right", new SpriteAnimation(meaty, 0, 0, 4)); //1st row
  character3.addAnimation("left", new SpriteAnimation(meaty, 0, 0, 4)); // scale this so left is facing left
  character3.addAnimation("up", new SpriteAnimation(meaty, 0, 5, 4)); //1st column 5th row
  character3.addAnimation("down", new SpriteAnimation(meaty, 7, 5, 4)); //7th column 5th row
  character3.addAnimation("idle", new SpriteAnimation(meaty, 0, 0, 0)); //adjust this one later
  character3.currentAnimation = "idle";
}

function draw() {
  background(220);
  character.draw();
  chick1.draw();
  character3.draw();
}

function keyPressed() {
  // Controls for all characters
  if (keyCode == RIGHT_ARROW) {
    character.currentAnimation = "right";
    character.lastDirection = "right";
    chick1.currentAnimation = "right";
    chick1.lastDirection = "right";
    character3.currentAnimation = "right";
    character3.lastDirection = "right";
  }
  if (keyCode == LEFT_ARROW) {
    character.currentAnimation = "left";
    character.lastDirection = "left";
    chick1.currentAnimation = "left";
    chick1.lastDirection = "left";
    character3.currentAnimation = "left";
    character3.lastDirection = "left";
  }
  if (keyCode == UP_ARROW) {
    character.currentAnimation = "up";
    character.lastDirection = "up";
    chick1.currentAnimation = "up";
    chick1.lastDirection = "up";
    character3.currentAnimation = "up";
    character3.lastDirection = "up";
  }
  if (keyCode == DOWN_ARROW) {
    character.currentAnimation = "down";
    character.lastDirection = "down";
    chick1.currentAnimation = "down";
    chick1.lastDirection = "down";
    character3.currentAnimation = "down";
    character3.lastDirection = "down";
  }
  if (keyCode == 32) {
    character.currentAnimation = character.lastDirection;
    chick1.currentAnimation = chick1.lastDirection;
    character3.currentAnimation = character3.lastDirection;
  }
}

function keyReleased() {
  
  character.currentAnimation = "idle";
  chick1.currentAnimation = "idle";
  character3.currentAnimation = "idle";
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.lastDirection = "idle";
    this.animations = {};
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation != null) {
      switch (this.currentAnimation) {
        case "right":
          if (this.x + 3 < width) {
            this.x += 3;
          }
          break;
        case "left":
          if (this.x - 3 >= 0) {
            this.x -= 3;
          }
          break;
        case "up":
          if (this.y - 3 >= 0) {
            this.y -= 3;
          }
          break;
        case "down":
          if (this.y + 3 < height) {
            this.y += 3;
          }
          break;
        case "idle":
          break;
      }

      push();
      translate(this.x, this.y);
      if (this.lastDirection === "left") {
        animation.draw(true);
      } else {
        animation.draw();
      }
      pop();
    }
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.framecount = 0;
  }

  draw(flip = false) {
    if (flip) {
      push();
      scale(-1, 1);
      image(this.spritesheet, -80, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);
      pop();
    } else {
      image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);
    }

    this.framecount++;
    if (this.framecount % 8 == 0) {
      this.u++;
    }
    if (this.u >= this.startU + this.duration) {
      this.u = this.startU;
    }
  }
}