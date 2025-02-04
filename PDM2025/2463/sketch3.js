function setup() {
    //pacman
    // can do circle with triangle inside 
    
    
    //size of our canvas x,y
    createCanvas(500,200);
    
    // bg color, different ways to assign,
    // can do values 0 - 255, with 0 being black
    // can do 'black' (wrapped in colon) see color ref
    background('black');
    
    
    
    //color first then shape? odd.
    //color rgb/h
    //google color rgb
    fill(255,255,0);
    // circle x,y,z
    circle(100,100,150);
  
    //black triangle
    fill(0);
    //six args x1,y1 x2,y2 x3,y3
    //trial and error tbh
    triangle(90, 100, 20, 20, 20, 200);
    
    
    //red ghost
    fill(255,80,50);
    
    //round off a square
    //square x,y,z then corner radius
    // can give aggressive round off 
    square(250, 45, 125, 90, 90, 0, 0);
    
    
    //eyes, can maybe do large stroke for white and then just have blue eyes
    //
    
    fill(255);
    circle(280,100,30);
    circle(345,100,30);
    
    fill(0, 0, 255);
    circle(280, 100, 19);
    circle(345, 100, 19);
  
    
    
  
  }