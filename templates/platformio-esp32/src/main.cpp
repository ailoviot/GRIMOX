#include <Arduino.h>
#include "config.h"

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Hello from Grimox (PlatformIO)");

  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED ON");
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
