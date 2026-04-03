# MicroPython ESP32

Minimal MicroPython project for ESP32 with WiFi and LED blink.

## Prerequisites

- ESP32 flashed with [MicroPython firmware](https://micropython.org/download/ESP32_GENERIC/).
- [Thonny](https://thonny.org/) or [mpremote](https://docs.micropython.org/en/latest/reference/mpremote.html) installed.

## Upload files

### Using Thonny

1. Open Thonny and select **MicroPython (ESP32)** as the interpreter.
2. Open each file and save it to the device (File > Save as > MicroPython device).

### Using mpremote

```bash
mpremote cp config.py boot.py main.py :
```

## Configuration

Edit `config.py` with your WiFi credentials before uploading:

```python
WIFI_SSID = 'your-ssid'
WIFI_PASSWORD = 'your-password'
```

## What it does

- `boot.py` runs first and connects to WiFi.
- `main.py` blinks the built-in LED (GPIO 2) and prints to REPL every second.
