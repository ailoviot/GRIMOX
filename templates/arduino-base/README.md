# Arduino Base — ESP32

Minimal Arduino IDE project for ESP32 with WiFi and LED blink.

## Setup

1. Open `arduino-base.ino` in Arduino IDE.
2. Install the **ESP32** board package:
   - Go to **File > Preferences** and add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools > Board > Boards Manager**, search for **esp32**, and install.
3. Select your board: **Tools > Board > ESP32 Dev Module**.
4. Edit `config.h` with your WiFi credentials.
5. Select the correct COM port under **Tools > Port**.
6. Click **Upload**.

## What it does

- Connects to WiFi and prints the IP address to Serial (115200 baud).
- Blinks the built-in LED (GPIO 2) every second.
