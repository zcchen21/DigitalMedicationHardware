#include <stdio.h>
#include <stdlib.h>

// define pin numbers for LEDs and button
#define YELLOW 13
#define GREEN 12
#define RED 11
#define BLUE 10
#define BUTTON 3

// size of the buffer that contains the instruction
#define BUF_SIZE 50

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
        // Serial.print("You sent me: ");
        // Serial.println(data);
        parseDispense(data);
        resetBuf();
        // Serial.print("Compartment: ");
        // Serial.print(compartment);
        // Serial.print(" Amount: ");
        // Serial.println(amount);
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
    compartment = atoi(token);
    token = strtok(NULL, " ");
    amount = atoi(token);
}

void resetBuf() {
    memset(data, 0, sizeof(data));
}

void clear_LEDs() {
    digitalWrite(YELLOW, LOW);
    digitalWrite(BLUE, LOW);
    digitalWrite(GREEN, LOW);
    digitalWrite(RED, LOW);
}

void dispense(int compartment, int amount) {
    for (int i = 0; i < amount; i++) {
        delay(200);
        clear_LEDs();
        delay(200);
        dispenseOne(compartment);
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