int vibR = 21;
int vibL = 16;
int infraPin[] = { 33, A0, 32, A1 };

bool current_inf[4] = {false, false, false, false};
bool previous_inf[4] = {false, false, false, false};

long counter;
long current_time;
bool touch = false;

void setup() {
  pinMode(vibR, OUTPUT);
  pinMode(vibL, OUTPUT);

  // 모든 적외선 센서 핀을 입력으로 설정
  for (int i = 0; i < 4; i++) {
    pinMode(infraPin[i], INPUT);
  }

  Serial.begin(115200);
}

bool readStableInput(int pin) {
  int hitCount = 0;
  for (int i = 0; i < 3; i++) {
    if (digitalRead(pin) == HIGH) {
      hitCount++;
    }
  }
  return (hitCount >= 2); // 3번 중 2번 이상 HIGH가 감지되면 true 반환
}

void loop() {
  current_time = millis();  // 현재 시간 갱신
  bool stateChanged = false;

  for (int i = 0; i < 4; i++) {
    bool sensorValue = readStableInput(infraPin[i]);
    if (sensorValue != current_inf[i]) {
      stateChanged = true;
      current_inf[i] = sensorValue;
    }
  }
  

  if (stateChanged)  {  // 이전 상태와 현재 상태 비교
    counter = millis();
    touch = false;
  }

  if (((current_time - counter) > 100) && !touch) {
    for (int i = 0; i < 4; i++) {
      Serial.print(current_inf[i] ? '1' : '0');
    }
    Serial.println();

    bool anyLeft = current_inf[0] || current_inf[1];
    bool anyRight = current_inf[2] || current_inf[3];

    if (!anyLeft && !anyRight) {
      Serial.println("viboff");
      digitalWrite(vibL, LOW);
      digitalWrite(vibR, LOW);
    } else {
      if (anyLeft) {
        Serial.println("leftvib");
        digitalWrite(vibL, HIGH);
      }
      if (anyRight) {
        Serial.println("rightvib");
        digitalWrite(vibR, HIGH);
      }
      if (anyLeft && anyRight) {
        Serial.println("vibOnBoth");
      }
    }

    touch = true;
  }
}
