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
    print('i is ' + str(i))
    if i < 6:
        msg = str(i)
        i += 1
    else:
        msg = ''
        i = 1
    handler.send(msg)
    print('msg: ' + msg)
    time.sleep(3)
