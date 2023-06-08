from machine import Pin
import time
import sys
import uselect
from sys import stdin

led = Pin("LED", Pin.OUT)
led_yellow = Pin(10, Pin.OUT)
led_green = Pin(11, Pin.OUT)
led_red = Pin(12, Pin.OUT)
led_blue = Pin(13, Pin.OUT)
# buzzer = Pin(28, Pin.OUT)
# button = Pin(15, Pin.IN, Pin.PULL_DOWN)

TERMINATOR = '\n'

# store read in bytes from serial here.
buffered_input = []
# when we get a full line store it here, without the terminator.
# gets overwritten if a new line is read (as early as next tick).
input_line_this_tick = ""

def read_serial_input():
    global buffered_input
    global input_line_this_tick
 
    select_result = uselect.select([stdin], [], [], 0)  # wait for I/O input
    while select_result[0]:  # if read from stdin is available
        input_character = stdin.read(1)  # read in 1 byte at a time
        buffered_input.append(input_character)   # append the byte to the buffer
        select_result = uselect.select([stdin], [], [], 0)   # check if there's any input remaining from stdin
        
    # if no more input from stdin, '\n' would've been appended to the end
    if TERMINATOR in buffered_input:
        line_ending_index = buffered_input.index(TERMINATOR)  # find the index of '\n'
        input_line_this_tick = "".join(buffered_input[:line_ending_index])   # grab the line in the buffer without '\n'
    
#         if line_ending_index < len(buffered_input):
#             buffered_input = buffered_input[line_ending_index + 1 :]
#         else:
#             buffered_input = []

        buffered_input = []   # clear the buffer
    # otherwise clear the last full line so subsequent ticks can infer the same input is new input (not cached)
#     else:
#         input_line_this_tick = ""


while True:
    read_serial_input()  
#     if input_line_this_tick == '1' or input_line_this_tick == '3' or input_line_this_tick == '5':
#         led.value(1)
#     elif input_line_this_tick == '2' or input_line_this_tick == '4' or input_line_this_tick == '6':
#         led.value(0)
#     input_line_this_tick = input('Enter an input: ')
    if input_line_this_tick:
        inputs = input_line_this_tick.strip().split()
        print(inputs)
        if '1' in inputs:
            led_yellow.on()
        if '2' in inputs:
            led_green.on()
        if '3' in inputs:
            led_red.on()
        if '4' in inputs:
            led_blue.on()
        time.sleep(2)
    else:
        led_yellow.off()
        led_green.off()
        led_red.off()
        led_blue.off()
        
    input_line_this_tick = ""
    
