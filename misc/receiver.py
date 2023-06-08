from machine import Pin
import time

led_red = Pin(16, Pin.OUT)
led_blue = Pin(17, Pin.OUT)
led_yellow = Pin(18, Pin.OUT)
buzzer = Pin(28, Pin.OUT)
button = Pin(15, Pin.IN, Pin.PULL_DOWN)

# uart = machine.UART(0, baudrate=9600, bits=8, parity=None, stop=1, tx=None, rx=None)
# while True:
#     if uart.any():
#         data = uart.readline().strip()
#     time.sleep(0.1)

input_string = '1 3'
is_new_input = True
start_time = time.time()

while True:
    # print(button.value())
    # print(flag)
    # print(start_time)
    # print(time.time())
    # print(time.time() - start_time)
    # print(is_new_input)
    inputs = input_string.strip().split()

    if button.value():
        led_red.off()
        led_blue.off()
        led_yellow.off()
        buzzer.off()
        is_new_input = False
        message = 'Button pressed, confirmation received'
        print(message)
        # uart.write(message.encode())
        time.sleep(1)
        # uart.deinit()
    else:
        if is_new_input:
            if '1' in inputs:
                led_red.on()
            if '2' in inputs:
                led_blue.on()
            if '3' in inputs:
                led_yellow.on()
            buzzer.on()
            # if time.time() - start_time >= 180:
            #     is_new_input = False
        else:
            led_red.off()
            led_blue.off()
            led_yellow.off()
            buzzer.off()
    
