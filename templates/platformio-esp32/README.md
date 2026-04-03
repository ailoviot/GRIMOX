# PlatformIO ESP32

Minimal PlatformIO project for ESP32 with LED blink and Serial output.

## Prerequisites

- [PlatformIO Core (CLI)](https://docs.platformio.org/en/latest/core/installation.html) or the PlatformIO IDE extension for VS Code.

## Usage

1. Edit `include/config.h` with your WiFi credentials and pin configuration.

2. Build the project:
   ```bash
   pio run
   ```

3. Upload to the ESP32:
   ```bash
   pio run -t upload
   ```

4. Open Serial Monitor (115200 baud):
   ```bash
   pio device monitor
   ```

## What it does

- Blinks the built-in LED (GPIO 2) every second.
- Prints "LED ON" / "LED OFF" to Serial.
