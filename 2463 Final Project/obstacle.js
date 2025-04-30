class Obstacle {
    constructor(isAirborne = false, linkedGroundObstacle = null) {
        this.h = 50;
        this.w = 20;
        this.x = width;
        this.isAirborne = isAirborne;
        this.hit = false; // Ensure this is initialized to false

        if (this.isAirborne) {
            if (linkedGroundObstacle) {
                this.y = linkedGroundObstacle.y - 185; // Fixed offset
            } else {
                this.y = height - this.h - 185; // Fixed height if not linked
            }
        } else {
            this.y = height - this.h; // Ground obstacle
        }
    }

    move() {
        this.x -= speed; // Use the global speed variable
    }

    show() {
        rect(this.x, this.y, this.w, this.h);
    }
}