
int vib1 = 4;
int infraredPin1a = 33;
int infraredPin1b = A0;  //26;

int vib2 = 21;
int infraredPin2a = 32;
int infraredPin2b = 25;  //A1
int greeting;

void setup() {
  pinMode(vib1, OUTPUT);
  pinMode(vib2, OUTPUT);
  pinMode(infraredPin1a, INPUT);
  pinMode(infraredPin1b, INPUT);
  pinMode(infraredPin2a, INPUT);
  pinMode(infraredPin2b, INPUT);

  Serial.begin(115200);
}

void loop() {



  
  digitalWrite(vib1, 1);
   

}
