function setup() {
    createCanvas(400, 400);
    background('darkblue'); 
    
    // start with green circle, with white stroke
   
    
    //color of circle
    fill(0, 135, 0);
    // white outline
    stroke(255);
    // make the white outline bigger
    strokeWeight(4);
    // our circle x,y,z
    circle(200, 200, 200);
    
    //star function i found on examples
    //star color
    // params x,y, r1,r2 ,points
    // 
    fill(255,0,0);
    star(200,200, 40, 110, 5);
    
    
    function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 1; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
  
  }
  