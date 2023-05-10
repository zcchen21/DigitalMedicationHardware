#include <Stepper.h>
int stepsPerRevolution = 2048;
int motSpeed = 15;
int dt = 500;

int motDir = 1;
int buttonPin = 2;
int buttonValNew;
int buttonValOld = 1;

int LED_PIN1=7;
int LED_PIN2=6;
int LED_PIN3=4;
// In1 8
// In2 9
// In3 10
// In4 11
Stepper myStepper(stepsPerRevolution, 8, 10, 9, 11);
void setup() {
  // put your setup code here, to run once:
Serial.begin(9600);
myStepper.setSpeed(motSpeed);
pinMode(buttonPin, INPUT);
pinMode(LED_PIN1, OUTPUT);
pinMode(LED_PIN2, OUTPUT);
pinMode(LED_PIN3, OUTPUT);

digitalWrite(buttonPin, HIGH);
}

void loop() {
int count = Serial.parseInt();

    switch (count) {
      case 1:
        digitalWrite(LED_PIN1, HIGH);
        break;

      case 2:
        digitalWrite(LED_PIN2, HIGH);
        break;

      case 3:
        digitalWrite(LED_PIN3, HIGH);
        break;

      case 4:
      //This is the main function for the stepper motor. This will dispense 1 pill very input. 
      //Can adjust this value if we get a different quantity from the app. 
        myStepper.step(stepsPerRevolution/4);
        break;
    }

count = 0;
}
