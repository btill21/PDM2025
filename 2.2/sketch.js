let organSynth, filt, rev, lfo, noise, noiseEnv;
let activeKeys = new Set(); 


let keyNotes = {
  'a': 'C4', 's': 'D4', 'd': 'E4','f': 'F4', 
  'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5'
};

function setup() {
  createCanvas(400, 400);


  rev = new Tone.Reverb({ decay: 3 }).toDestination();
  filt = new Tone.Filter(1000, "lowpass").connect(rev);

  organSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" }, 
    envelope: { attack: 0.2, decay: 0.3, sustain: 0.8, release: 1 }
  }).connect(filt);
  organSynth.volume.value = -10;

  lfo = new Tone.LFO(0.3, -5, 5).start(); 
  lfo.connect(organSynth.detune);


  noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 0.1, decay: 0.5, sustain: 0.3, release: 1
  }).toDestination();
  
  noise = new Tone.Noise("white").start().connect(noiseEnv); 
}

function draw() {
  background(220);
  textSize(16);
  fill(0);
  text('Press a - k to play notes');
}


function keyPressed() {
  let pitch = keyNotes[key];
  if (pitch && !activeKeys.has(key)) {
    organSynth.triggerAttack(pitch);
    activeKeys.add(key);
  } else if (key === "z") {
    noiseEnv.triggerAttack();
  }
}

function keyReleased() {
  let pitch = keyNotes[key];
  if (pitch) {
    organSynth.triggerRelease(pitch);
    activeKeys.delete(key);
  } else if (key === "z") {
    noiseEnv.triggerRelease();
  }
}
