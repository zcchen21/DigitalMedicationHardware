from machine import Pin
import time

input = 2
is_new_input = True

led_red = Pin(16, Pin.OUT)
led_blue = Pin(17, Pin.OUT)
led_yellow = Pin(18, Pin.OUT)
buzzer = Pin(28, Pin.OUT)
button = Pin(15, Pin.IN, Pin.PULL_DOWN)

while True:
    # print(button.value())
    # print(flag)
    if button.value():
        led_red.off()
        led_blue.off()
        led_yellow.off()
        buzzer.off()
        is_new_input = False
        time.sleep(0.5)
    else:
        if is_new_input:
            if input == 1:
                led_red.on()
            elif input == 2:
                led_blue.on()
            else:
                led_yellow.on()
            buzzer.on()
        else:
            led_red.off()
            led_blue.off()
            led_yellow.off()
            buzzer.off()
