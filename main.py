from machine import Pin
import time
import sys
import uselect
from sys import stdin

led = Pin("LED", Pin.OUT)

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
    if input_line_this_tick == '1' or input_line_this_tick == '3' or input_line_this_tick == '5':
        led.value(1)
    elif input_line_this_tick == '2' or input_line_this_tick == '4' or input_line_this_tick == '6':
        led.value(0)
    input_line_this_tick = ""
