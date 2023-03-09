import serial
import time

TERMINATOR = '\n'


class Handler:

    def __init__(self, device, baudrate):
        self.serial = serial.Serial(device, baudrate)

    def send(self, text):
        self.serial.write((text + TERMINATOR).encode('UTF8'))

    def receive(self):
        text = self.serial.read_until(TERMINATOR)
        return text.decode('UTF8').strip()

    def close(self):
        self.serial.close()


handler = Handler('/dev/ttyACM0', 115200)

msg = ''
i = 1

while True:
    msg = '1 2 3 4'
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = ''
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = ' 1  3 '
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = ''
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = '2   4'
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = ''
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = '2 3 4'
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
    msg = ''
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(2)
