#define YELLOW 13
#define BLUE 12
#define GREEN 11
#define RED 10
#define BUTTON 3

volatile bool flag;

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
        String data = Serial.readStringUntil('\n');
        dispense(data);
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

void dispense(String data) {
    if (data == "1") {
        digitalWrite(YELLOW, HIGH);
    } else if (data == "2") {
        digitalWrite(GREEN, HIGH);
    } else if (data == "3") {
        digitalWrite(RED, HIGH);
    } else if (data == "4") {
        digitalWrite(BLUE, HIGH);
    } 
}