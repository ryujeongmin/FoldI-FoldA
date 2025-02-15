int vib2 = 21;
int vib1 = 16;
int infraPin[] = { 33, A0, 32, A1 };
int infraVal[] = { 0, 0, 0, 0 };

bool greeting = false;

void setup() {
  pinMode(vib1, OUTPUT);
  pinMode(vib2, OUTPUT);

  for (int i = 0; i < 4; i++) {
    pinMode(infraPin[i], INPUT);
  }

  Serial.begin(115200);
}

void loop() {
  for (int i = 0; i < 4; i++) {
    infraVal[i] = digitalRead(infraPin[i]);
    Serial.print(infraVal[i]);
  }
  Serial.println("");

  if(infraVal[0]||infraVal[1]){
  digitalWrite(vib1, 1);
  }else{
  digitalWrite(vib1,0);
  }

  if(infraVal[2]||infraVal[3]){
  digitalWrite(vib2, 1);
  }
  else{
  digitalWrite(vib2,0);
  }
}
