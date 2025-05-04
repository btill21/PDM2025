const int buttonPin = 2;
const int ledPins[] = {9, 10, 11}; // LEDs wired to these pins
const int buzzerPin = 7;
int lives = 3;
bool wasPressed = false;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
  for (int i = 0; i < 3; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], HIGH); // start with all LEDs ON
  }
}

void loop() {
  bool pressed = digitalRead(buttonPin) == LOW;

  // Send "jump" on new press
  if (pressed && !wasPressed) {
    Serial.println("jump");
    delay(200); // debounce
  }
  wasPressed = pressed;

  // Listen for messages from p5
  if (Serial.available()) {
    String msg = Serial.readStringUntil('\n');

    if (msg == "hit") {
      if (lives > 0) lives--;
      tone(buzzerPin, 1000,200);
      updateLEDs();
    } else if (msg == "reset") {
      lives = 3;
      updateLEDs();
      playStartupSound();
    } else if (msg == "gameover") {
      for (int i = 0; i < 3; i++) {
        digitalWrite(ledPins[i], LOW);
      }
      playGameOverSound();
    }
  }
  static unsigned long lastVolumeSend = 0;
  if (millis() - lastVolumeSend > 100) {
  int potValue = analogRead(A0);
  Serial.print("volume:");
  Serial.println(potValue);
  lastVolumeSend = millis();
}



}

void updateLEDs() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(ledPins[i], i < lives ? HIGH : LOW);
  }
}

void playGameOverSound() {
  tone(buzzerPin, 523, 200);
  delay(250);
  tone(buzzerPin, 392, 300); 
  delay(350);
  tone(buzzerPin, 261, 600); 
  delay(650);
  noTone(buzzerPin);
}

void playStartupSound() {
  tone(buzzerPin, 330, 150); 
  delay(200);
  tone(buzzerPin, 392, 150); 
  delay(200);
  tone(buzzerPin, 523, 300); 
  delay(350);
  noTone(buzzerPin);
}

