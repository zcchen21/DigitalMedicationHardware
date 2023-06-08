# Digital Medication Management - Hardware

Welcome to the github repository of the Digital Medication Management hardware team!
In this repository, you will find the files used in the development and testing of the dispenser.

# Organization

## sketches
A folder containing various Arduino sketches. For the final product, the sketch _main_ is used.

## server
A folder containing files used for the dispenser server. For the final product, the file _server-confirm.js_ is used.

## misc
A folder containing various miscellaneous files. 

# User Manual

## Server
PM2 (https://pm2.keymetrics.io/) is used to keep the server running. It automatically starts the server on reboot, and keeps it running indefinitely. PM2 is also used to keep ngrok running, which provides a tunnel to the localhost that the server runs on. As long as both the server-confirm process and ngrok process are running on PM2, the server will be active.

## Wiring

Shown below is the wiring diagram. The stepper motor wiring is a bit difficult to read, so just follow the wiring defined in the _main.ino_ file.
![Schematic_final-schematic_2023-06-07 (1)](https://github.com/zcchen21/DigitalMedicationHardware/assets/86216203/8d09e3f7-7341-4d95-8084-c4dce71d54cc)
