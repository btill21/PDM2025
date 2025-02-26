let soundFiles = [];
let buttons = [];
let slider;
let filter;

function preload() {
  soundFormats('mp3', 'ogg');

  soundFiles.push(loadSound('media/work-it-101soundboards.mp3'));
  soundFiles.push(loadSound('media/make-it-101soundboards.mp3'));
  soundFiles.push(loadSound('media/do-it-101soundboards.mp3'));
  soundFiles.push(loadSound('media/makes-us-101soundboards.mp3'));
  
  soundFiles.push(loadSound('media/harder-101soundboards.mp3'));
  soundFiles.push(loadSound('media/better-101soundboards.mp3'));
  soundFiles.push(loadSound('media/faster-101soundboards(1).mp3'));
  soundFiles.push(loadSound('media/stronger-101soundboards.mp3'));
  
  soundFiles.push(loadSound('media/more-than-101soundboards.mp3'));
  soundFiles.push(loadSound('media/hour-101soundboards.mp3'));
  soundFiles.push(loadSound('media/Daft Punk - Harder Better Faster Stronger (Lyrics) (mp3cut.net).mp3'));
  soundFiles.push(loadSound('media/never-101soundboards.mp3'));
  
  soundFiles.push(loadSound('media/ever-101soundboards.mp3'));
  soundFiles.push(loadSound('media/after-101soundboards.mp3'));
  soundFiles.push(loadSound('media/work-is-101soundboards.mp3'));
  soundFiles.push(loadSound('media/over-101soundboards.mp3'));
}

function setup() {
  createCanvas(600, 600);
  
  filter = new p5.LowPass();
  
  soundFiles.forEach(sound => sound.disconnect()); 
  soundFiles.forEach(sound => sound.connect(filter));

  slider = createSlider(100, 5000, 1000);
  slider.position(10, 140);
  slider.style('width', '300px');

  createButton('Play Sound 1').position(10, 10).mousePressed(() => playSound(0));
  createButton('Play Sound 2').position(110, 10).mousePressed(() => playSound(1));
  createButton('Play Sound 3').position(210, 10).mousePressed(() => playSound(2));
  createButton('Play Sound 4').position(310, 10).mousePressed(() => playSound(3));

  createButton('Play Sound 5').position(10, 40).mousePressed(() => playSound(4));
  createButton('Play Sound 6').position(110, 40).mousePressed(() => playSound(5));
  createButton('Play Sound 7').position(210, 40).mousePressed(() => playSound(6));
  createButton('Play Sound 8').position(310, 40).mousePressed(() => playSound(7));

  createButton('Play Sound 9').position(10, 70).mousePressed(() => playSound(8));
  createButton('Play Sound 10').position(110, 70).mousePressed(() => playSound(9));
  createButton('Play Sound 11').position(210, 70).mousePressed(() => playSound(10));
  createButton('Play Sound 12').position(310, 70).mousePressed(() => playSound(11));

  createButton('Play Sound 13').position(10, 100).mousePressed(() => playSound(12));
  createButton('Play Sound 14').position(110, 100).mousePressed(() => playSound(13));
  createButton('Play Sound 15').position(210, 100).mousePressed(() => playSound(14));
  createButton('Play Sound 16').position(310, 100).mousePressed(() => playSound(15));
}

function draw() {
  background(220);
  text('Frequency', 10, 180);
  filter.freq(slider.value());
}

function playSound(index) {
  let sound = soundFiles[index];
  if (!sound.isPlaying()) {
    sound.play();
  }
}
