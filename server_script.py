#!/usr/bin/env python3

import sys
import serial
import time

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.reset_input_buffer()

    # msg1 = input() + '\n'
    # print("msg1 from input:", msg1)

    msg = sys.argv[1]

    # ser.write(msg1.encode('utf-8'))
    # while True:
    #   if ser.in_waiting > 0:
    #     response = ser.readline().decode('utf-8').rstrip()
    #     if '\n' in response:
    #       break

    ser.write(msg.encode('utf-8'))
    time.sleep(0.5)
    response = ser.readline().decode('utf-8').rstrip()
    time.sleep(0.5)

    print('msg:', msg, 'response', response)
