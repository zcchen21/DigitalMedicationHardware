#!/usr/bin/env python3

import sys
import serial
import time

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.reset_input_buffer()

    # msg1 = input() + '\n'
    # print("msg1 from input:", msg1)

    arg = str(sys.argv[1])
    # arg = arg + '\n'
    # arg = input("Enter a message: ")

    # ser.write(msg1.encode('utf-8'))
    # while True:
    #   if ser.in_waiting > 0:
    #     response = ser.readline().decode('utf-8').rstrip()
    #     if '\n' in response:
    #       break

    time.sleep(2)
    ser.write(arg.encode('utf-8'))
    # ser.write('\n'.encode('utf-8'))
    time.sleep(0.5)
    print(ser.readline().decode('utf-8').rstrip())
    time.sleep(0.5)

    print('arg:', arg)
    # print('res:', response)
