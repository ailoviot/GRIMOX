import machine
import time
from config import LED_PIN

led = machine.Pin(LED_PIN, machine.Pin.OUT)

print("Hello from Grimox (MicroPython)")

while True:
    led.value(1)
    print("LED ON")
    time.sleep(1)

    led.value(0)
    print("LED OFF")
    time.sleep(1)
