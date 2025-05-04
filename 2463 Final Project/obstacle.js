
class Obstacle {
 
  constructor(isAirborne = false) {
    this.x = width;              
    this.y = isAirborne ? height - 350 : height - 60; 
    this.width = 50;            
    this.height = 50;           
    this.speed = speed;         
    this.animation = new SpriteAnimation(obstacleSprite, 0, 0, 1, true); 
  }


  move() {
    this.x -= speed;
  }

  draw() {
    this.animation.draw(this.x, this.y);
  }
}