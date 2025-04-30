let obstacles;
let randint;
let score;
let lost;
let next;
let spread;
let slider;
let speed; // New variable to control game speed
let lives; // New variable to track lives

function setup() {
  createCanvas(600, 450);
  textSize(24);
  slider = createSlider(10, 20, 12, 1);
  slider.position(width - slider.width, 0);
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

function resetSketch() {
  console.log("Restarting game");
  score = 0;
  lost = false;
  obstacles = [];
  next = 0;
  speed = 6; // Initial speed
  lives = 3; // Start with 3 lives
  dinosaur = new Dinosaur();
  new Obstacle();
  randint = int(random(50, 150));
  loop();
}

function draw() {
  background(220);

  // Draw the score
  fill(0); // Reset to black for the score
  text(`Score: ${score}`, 5, 24);

  // Draw hearts for lives
  let heartSpacing = 30;
  let heartsWidth = lives * heartSpacing;
  let startX = (width - heartsWidth) / 2; // Center the hearts

  for (let i = 0; i < lives; i++) {
    fill(255, 0, 0); // Red color for hearts
    noStroke();
    ellipse(startX + i * heartSpacing, 20, 20, 20); // Draw hearts as circles
  }

  // Reset fill color for other elements
  fill(0); // Reset to black for obstacles and dinosaur
  next += 1;

  // Gradually increase speed
  speed += 0.001;

  if (next == randint) {
    let groundObstacle = new Obstacle(false);
    obstacles.push(groundObstacle);

    if (random(1) < 0.4) {
      let airborneEnemy = new Obstacle(true, groundObstacle);
      obstacles.push(airborneEnemy);
    }

    score += 1;
    next = 0;
    randint = int(random(40, width / 5));
  }

  for (let o of obstacles) {
    if (o.x < 0) {
      if (!o.hit) {
        score += 1; // Increment score only if the obstacle was not hit
      }
      obstacles.shift(); // Remove the obstacle
    }
    o.move();
    o.show();
    if (dinosaur.hits(o) && !o.hit) { // Check if the obstacle has already been hit
      console.log("Hit obstacle!");
      lives -= 1; // Decrease lives
      o.hit = true; // Mark the obstacle as hit

      if (lives <= 0) {
        console.log("Game Over!");
        lost = true;
        noLoop();
      }
    }
  }

  dinosaur.show();
  dinosaur.move();
}