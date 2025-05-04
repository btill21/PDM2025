
class Dinosaur {
 
  constructor() {
    this.x = 100; 
    this.height = 50; 
    this.offsetFromGround = 20; 
    this.y = height - this.height - this.offsetFromGround; 
    this.vy = 0;                // Vertical velocity
    this.gravity = 0.6;         // Gravity force
    this.jumpStrength = 15;     // Jump power
    this.currentAnimation = "running";
    this.animations = {};       // Stores all animation states
    this.hurtDuration = 30;     // Duration of hurt animation
    this.hurtTimer = 0;         // Tracks hurt animation progress

    // Animations
    this.addAnimation("running", new SpriteAnimation(dinosaurRunning, 0, 0, 6));
    this.addAnimation("jumping", new SpriteAnimation(dinosaurJumping, 0, 0, 1, true));
    this.addAnimation("hurt", new SpriteAnimation(dinosaurHurt, 1, 0, 1, true)); 
  }

  /**
   * Adds a new animation to the dinosaur's animation set
   * @param {string} key - Name of the animation
   * @param {SpriteAnimation} animation - The animation object to add
   */
  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  /**
   * Makes the dinosaur jump if it's on the ground
   * Plays jump sound effect and changes animation state
   */
  jump() {
    if (this.y === height - this.height - this.offsetFromGround) { 
      this.vy = -this.jumpStrength;
      this.currentAnimation = "jumping";

      if (jumpSound) {
        jumpSound.play();
      }
    }
  }

  /**
   * Updates the dinosaur's position and animation state
   * Handles gravity, ground collision, and animation transitions
   */
  move() {
    // Apply gravity and update position
    this.y += this.vy;
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.height - this.offsetFromGround);

    // Handle hurt animation
    if (this.hurtTimer > 0) {
      this.hurtTimer--;
      if (this.hurtTimer === 0) {
        this.currentAnimation = "running"; 
      }
    } else if (this.y === height - this.height - this.offsetFromGround) {
      this.currentAnimation = "running";
    }
  }

  /**
   * Draws the dinosaur using the current animation
   * Handles hurt animation flashing effect
   */
  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      // Flash effect during hurt animation
      if (this.hurtTimer > 0 && frameCount % 12 < 6) {
        return;
      }
      animation.draw(this.x, this.y);
    }
  }

  /**
   * Checks for collision with an obstacle
   * @param {Obstacle} obs - The obstacle to check collision with
   * @returns {boolean} - True if collision detected, false otherwise
   */
  hits(obs) {
    return collideRectRect(this.x, this.y, 50, this.height, obs.x, obs.y, obs.width, obs.height);
  }
}