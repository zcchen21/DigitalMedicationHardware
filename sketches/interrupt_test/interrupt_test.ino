#define YELLOW 13
#define BLUE 12
#define GREEN 11
#define RED 10
#define BUTTON 3

volatile bool flag;

void setup() {
    flag = 0;
    pinMode(YELLOW, OUTPUT);
    pinMode(BLUE, OUTPUT);
    pinMode(GREEN, OUTPUT);
    pinMode(RED, OUTPUT);
    pinMode(BUTTON, INPUT);
    attachInterrupt(digitalPinToInterrupt(BUTTON), isr, RISING);
    Serial.begin(9600);
}

void loop() {
    if (Serial.available()) {
        if (flag) {
            Serial.println("Medication not yet taken.");
            Serial.readStringUntil('\n');
        } else {
            flag = 1;
            String data = Serial.readStringUntil('\n');
            //Serial.readBytes(data, 1);
            Serial.print("You sent me: ");
            //Serial.println(data[0]);
            Serial.println(data);
            dispense(data);
        }
    }
}



void isr() {
    flag = 0;
    clear_LEDs();
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