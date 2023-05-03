// define pin numbers for LEDs and button
#define YELLOW 13
#define BLUE 12
#define GREEN 11
#define RED 10
#define BUTTON 3

volatile bool flag;
int compartment;
int amount;

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

void loop() {
    if (Serial.available()) {
        compartment = Serial.read();
        amount = Serial.read();
        dispense(compartment, amount);
        flag = 1;
    }
}



void isr() {
    if (flag) {
        flag = 0;
        Serial.write(1);
        clear_LEDs();
    }
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