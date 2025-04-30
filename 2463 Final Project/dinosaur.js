class Dinosaur {
    constructor() {
      this.r = 50
      this.x = this.r;
      this.y = height - this.r;
      this.vy = 0;
      this.gravity = 0.6;
    }
  
    jump() {
      this.elev = height - this.y - this.r
      if (this.elev == 0) {
        this.vy = -slider.value();
      }
    }
    
    hits(obs) {
      return collideRectRect(this.x,this.y,this.r,this.r,obs.x,obs.y,obs.w,obs.h)
    }
  
    move() {
      this.y += this.vy;
      this.vy += this.gravity
      this.y = constrain(this.y, 0, height - this.r)
    }
  
    show() {
      rect(this.x, this.y, this.r, this.r);
    }
  }