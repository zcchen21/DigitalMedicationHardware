#define YELLOW 13
#define BLUE 12
#define GREEN 11
#define RED 10
#define BUTTON 3

bool flag = 0;
//char data[1];

void setup() {
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
    //Serial.flush();
  }

  if (Serial.available() > 0) {

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

      clear_LEDs();

      // switch ((int)data[0]) {
      //   case (int)'1':
      //     digitalWrite(YELLOW, HIGH);
      //     break;
      //   case (int)'2':
      //     digitalWrite(BLUE, HIGH);
      //     break;
      //   case (int)'3':
      //     digitalWrite(GREEN, HIGH);
      //     break;
      //   case (int)'4':
      //     digitalWrite(RED, HIGH);
      //     break;
      //   default:
      //     break;
      // }

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

  }

}

void clear_LEDs() {
  digitalWrite(YELLOW, LOW);
  digitalWrite(BLUE, LOW);
  digitalWrite(GREEN, LOW);
  digitalWrite(RED, LOW);
}
