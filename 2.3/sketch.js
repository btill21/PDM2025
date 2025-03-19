let basicSynth, filt, LFOfilt, ampEnv;
let img;
let isMousePressed = false;

function preload() {
  img = loadImage('media/dominican_sound_systems_culture_fo_85682d5c-460_x2.jpg'); 
}

function setup() {
  createCanvas(400, 400);
  filt = new Tone.Filter(300, "lowpass", -48).toDestination();
  basicSynth = new Tone.Synth({
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.1
    }
  }).connect(filt);

  LFOfilt = new Tone.LFO(0.1, 200, 400).start();
  LFOfilt.connect(filt.frequency);

  ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1
  }).toDestination();

  basicSynth.connect(ampEnv);
}

function draw() {
  background(220);
  if (isMousePressed) {
    image(img, 0, 0, width, height); 
  }
}

function mousePressed() {
  isMousePressed = true;
  ampEnv.triggerAttack();
  basicSynth.triggerAttack("C2");
}

function mouseReleased() {
  isMousePressed = false;
  ampEnv.triggerRelease();
  basicSynth.triggerRelease();
}
