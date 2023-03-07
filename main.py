from machine import Pin
import time

led = Pin("LED", Pin.OUT)
uart = machine.UART(0, baudrate=115200)
while True:
    if uart.any():
        data = uart.read()
        if data == 'hello':
            led.value(1)
            time.sleep(5)
        else:
            led.value(0)
    time.sleep(0.1)
    
