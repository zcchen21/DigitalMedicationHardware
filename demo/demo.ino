#define YELLOW 13
#define BLUE 12
#define GREEN 11
#define RED 10
#define BUTTON 3
#define COMPARTMENTS 4

bool flag = 0;
//char data[1];
int medAmount[COMPARTMENTS];

void setup() {
  for (int i = 0; i < COMPARTMENTS; i++) {
    medAmount[i] = 3;
  }
  pinMode(YELLOW, OUTPUT);
  pinMode(BLUE, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(RED, OUTPUT);
  pinMode(BUTTON, INPUT);
  Serial.begin(9600);
}

void loop() {

  if (digitalRead(BUTTON)) {
    flag = 0;
    clear_LEDs();
  }

  if (Serial.available() > 0) {
    if (flag) {
      Serial.println("Medication not yet taken.");
      Serial.readStringUntil('\n');
    } else {
      clear_LEDs();
      dispense();
    }
  }

}



void clear_LEDs() {
  digitalWrite(YELLOW, LOW);
  digitalWrite(BLUE, LOW);
  digitalWrite(GREEN, LOW);
  digitalWrite(RED, LOW);
}

void dispense() {
  String data = Serial.readStringUntil('\n');
  if (data == "1") {
    if (medAmount[0] > 0) {
      digitalWrite(YELLOW, HIGH);
      Serial.print("Medication 1 dispensed. Medication remaining: ");
      medAmount[0]--;
      Serial.println(medAmount[0]);
      flag = 1;
    } else {
      Serial.println("Compartment 1 is out of medication.");
    }
  } else if (data == "2") {
    if (medAmount[1] > 0) {
      digitalWrite(GREEN, HIGH);
      Serial.print("Medication 2 dispensed. Medication remaining: ");
      medAmount[1]--;
      Serial.println(medAmount[1]);
      flag = 1;
    } else {
      Serial.println("Compartment 2 is out of medication.");
    }
  } else if (data == "3") {
    if (medAmount[2] > 0) {
      digitalWrite(RED, HIGH);
      Serial.print("Medication 3 dispensed. Medication remaining: ");
      medAmount[2]--;
      Serial.println(medAmount[2]);
      flag = 1;
    } else {
      Serial.println("Compartment 3 is out of medication.");
    }
  } else if (data == "4") {
    if (medAmount[3] > 0) {
      digitalWrite(BLUE, HIGH);
      Serial.print("Medication 4 dispensed. Medication remaining: ");
      medAmount[3]--;
      Serial.println(medAmount[3]);
      flag = 1;
    } else {
      Serial.println("Compartment 4 is out of medication.");
    }
  } else {
    Serial.println("Invalid input.");
  }
}
