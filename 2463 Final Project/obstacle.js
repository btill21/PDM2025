
class Obstacle {
  /**
   * @param {boolean} isAirborne - Whether the obstacle is in the air (true) or on the ground (false)
   */
  constructor(isAirborne = false) {
    this.x = width;              // Start at the right edge of the screen
    this.y = isAirborne ? height - 350 : height - 60; // Position based on type
    this.width = 50;             // Obstacle width
    this.height = 50;            // Obstacle height
    this.speed = speed;          // Movement speed (uses global speed)
    this.animation = new SpriteAnimation(obstacleSprite, 0, 0, 1, true); // Static animation
  }

  /**
   * Moves the obstacle from right to left
   */
  move() {
    this.x -= speed;
  }

  /**
   * Draws the obstacle using its animation
   */
  draw() {
    this.animation.draw(this.x, this.y);
  }
}