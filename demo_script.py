#!/usr/bin/env python3

import sys
import serial
import time

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.reset_input_buffer()
    while True:
        msg = input("Enter a message: ")
        ser.write(msg.encode('utf-8'))
        time.sleep(0.1)
        print(ser.readline().decode('utf-8').rstrip())
        time.sleep(0.1)
