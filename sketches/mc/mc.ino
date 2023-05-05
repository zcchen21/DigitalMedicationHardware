#include <stdio.h>
#include <stdlib.h>

// define pin numbers for LEDs and button
#define YELLOW 13
#define BLUE 12
#define GREEN 11
#define RED 10
#define BUTTON 3

// size of the buffer that contains the instruction
#define BUF_SIZE 20

volatile bool flag;
int compartment;
int amount;
char data[BUF_SIZE];

// SETUP:
//  sets the four LEDs to be outputs, the button to be an input
//  sets the button to be an interrupt
//  sets the LEDs to low
//  sets flag to zero
void setup() {
    pinMode(YELLOW, OUTPUT);
    pinMode(BLUE, OUTPUT);
    pinMode(GREEN, OUTPUT);
    pinMode(RED, OUTPUT);
    pinMode(BUTTON, INPUT);
    attachInterrupt(digitalPinToInterrupt(BUTTON), isr, RISING);
    clear_LEDs();
    flag = 0;
    Serial.begin(9600);
}

// LOOP:
//  checks if there is data on the serial line
//  if there is, reads bytes into a buffer
//  parse the instruction, and then dispense medication
//  sets flag to indicate that medication has been dispensed, but not yet taken
void loop() {
    if (Serial.available()) {
        Serial.readBytesUntil('/n', data, BUF_SIZE);
        parseDispense(data);
        dispense(compartment, amount);
        flag = 1;
    }
}


// interrupt service routine bound to the button
void isr() {
    if (flag) {
        flag = 0;
        Serial.write(1);
        clear_LEDs();
    }
}

void parseDispense(char* str) {
    char* token = strtok(str, " ");
    int compartment = atoi(token);
    token = strtok(NULL, " ");
    int amount = atoi(token);
}

void clear_LEDs() {
    digitalWrite(YELLOW, LOW);
    digitalWrite(BLUE, LOW);
    digitalWrite(GREEN, LOW);
    digitalWrite(RED, LOW);
}

void dispense(int compartment, int amount) {
    for (int i = 0; i < amount; i++) {
        dispenseOne(compartment);
        delay(200);
        clear_LEDs();
        delay(200);
    }
}

void dispenseOne(int compartment) {
    if (compartment == 1) {
        digitalWrite(YELLOW, HIGH);
    } else if (compartment == 2) {
        digitalWrite(GREEN, HIGH);
    } else if (compartment == 3) {
        digitalWrite(RED, HIGH);
    } else if (compartment == 4) {
        digitalWrite(BLUE, HIGH);
    } 
}