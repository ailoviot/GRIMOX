# ESP-IDF Project

Minimal ESP-IDF (C) project for ESP32 with LED blink and logging.

## Prerequisites

- [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/) installed and configured.
- `IDF_PATH` environment variable set.

## Usage

1. Edit `sdkconfig.defaults` with your WiFi credentials if needed.

2. Set the target chip:
   ```bash
   idf.py set-target esp32
   ```

3. Build the project:
   ```bash
   idf.py build
   ```

4. Flash to ESP32:
   ```bash
   idf.py flash
   ```

5. Monitor serial output:
   ```bash
   idf.py monitor
   ```

   (Press `Ctrl+]` to exit the monitor.)

## What it does

- Toggles the built-in LED (GPIO 2) every second.
- Logs "LED ON" / "LED OFF" via `ESP_LOGI`.
