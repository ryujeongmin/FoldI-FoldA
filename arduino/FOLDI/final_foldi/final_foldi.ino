#define PROTOTYPE_NAME "FoldI"
#define SERVER_NAME "toFoldI"
#define DATA_HEADER "fromFoldI"
#define HOST_SERVER "192.168.0.5"
#define PORT 8888

#include <SocketIoClient.h>
#include <ArduinoJson.h>

SocketIoClient socket;

const char* ssid = "cidrwifi";
const char* password = "cidr4558";

String btn = "aaaaaaaaaaaaaa";

int vibR = 4;
int array[] = { 13, 12, 27, 5, 15, 18, 14, 22, 23, 19, 16, 17, 33, 32 };
int vibL = A1;
int  previousValue[2] = { 0, 0 };              // 이전 값을 저장할 배열
static bool needsZero[2] = { false, false };  // 값이 전송된 후 0으로 초기화가 필요한지 추적
unsigned long lastSentTime[2] = { 0, 0 };     // 각 버튼 값이 전송된 시간을 추적
unsigned long startTimeR = 0; // 진동 모터 R 시작 시간
unsigned long startTimeL = 0; // 진동 모터 L 시작 시간
bool vibREnabled = false; 
bool vibLEnabled = f.....00..000000000000000000.0alse;  


void setup() {
  sock et.begin(HOST_SERVER, PORT);  //통신을 뚫겠다
  socket.on(SERVER_NAME, event);    // 특정  서버 이름 만 받아오겠다.
  WiFi.begin(ssid, password);

  Serial.begin(115200);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  /////////////////////////////////////////////////////////////////////////////
  Serial.println("");
  Serial.println("WiFi connected");

  //-----------SocketIO Setting-----------//
  socket.begin(HOST_SERVER, PORT);

  for (int i = 0; i < 14; i++) {
    pinMode(array[i], INPUT_PULLUP);
  }
  Serial.begin(115200);
  pinMode(vibR, OUTPUT);
  pinMode(vibL, OUTPUT);
}

String current_btn = "00000000000000";
String previous_btn = "00000000000000";

long counter;
long current_time;
bool sent;

//smoothing value
const int numSamples = 5;  // 샘플 수
// 특정 핀에서 아날로그 값을 읽고, 가장 자주 나타나는 값을 반환합니다.
int readAnalogMode(int pin) {
  int samples[numSamples];
  int frequency[10] = { 0 };  // 0부터 9까지의 숫자 빈도를 저장하는 배열

  // 아날로그 값 읽기
  for (int i = 0; i < numSamples; i++) {
    samples[i] = analogRead(pin);
    delay(10);
  }

  // 각 샘플을 0에서 9 사이의 값으로 변환하고 해당 값의 빈도를 증가시킵니다.
  for (int i = 0; i < numSamples; i++) {
    int value;

    if (samples[i] % 455 < 30) {
      value = 9 - (samples[i] + (samples[i] % 455)) / 455;  //애매한 값들 날려
    } else {
      value = 9 - (samples[i] / 455);
    }

    if (value >= 0 && value <= 9) {
      frequency[value]++;
    }
  }

  // 가장 높은 빈도를 찾고, 해당 숫자를 반환합니다.
  int maxFrequency = 0;
  int modeValue = 0;
  for (int i = 0; i < 10; i++) {
    if (frequency[i] > maxFrequency) {
      maxFrequency = frequency[i];
      modeValue = i;
    }
  }

  return modeValue;
}

void loop() {
  socket.loop();
  current_time = millis();

  for (int i = 0; i < 12; i++) {
    if (digitalRead(array[i]) == 0) {
      current_btn[i] = '1';
    } else {
      current_btn[i] = '0';
    }
  }

  for (int i = 12; i < 14; i++) {
    int currentValue = readAnalogMode(array[i]);
    if (abs(currentValue - previousValue[i - 12]) >= 3) {
      if (currentValue > previousValue[i - 12]) {
        current_btn[i] = '2';  // 값이 갑자기 커짐
      } else {
        current_btn[i] = '1';  // 값이 갑자기 작아짐
      }
      needsZero[i - 12] = true;         // 값이 변경되었으므로 다음 루프에서 0으로 초기화 필요
      lastSentTime[i - 12] = millis();  // 값이 전송된 시간을 기록
    }
    previousValue[i - 12] = currentValue;  // 현재 값을 이전 값으로 저장
  }

  if (!current_btn.equals(previous_btn)) {
    counter = millis();
    sent = false;
  }

  if (((current_time - counter) > 200) && (sent == false)) {
    DynamicJsonDocument collectedData(1024);
    collectedData["order"] = String(current_btn);
    String jsonData;
    serializeJson(collectedData, jsonData);
    socket.emit(DATA_HEADER, jsonData.c_str());
    sent = true;
    Serial.println(current_btn);

    // 소켓 전송 후 needsZero 플래그를 0으로 설정
    for (int i = 12; i < 14; i++) {
      if (needsZero[i - 12]) {
        needsZero[i - 12] = false;
        current_btn[i] = '0';
      }
    }
  }

  previous_btn = current_btn;

  // 진동 모터 R 끄기
  if (vibREnabled && (millis() - startTimeR >= 2000)) {
    digitalWrite(vibR, 0);
    vibREnabled = false;
  }

  // 진동 모터 L 끄기
  if (vibLEnabled && (millis() - startTimeL >= 2000)) {
    digitalWrite(vibL, 0);
    vibLEnabled = false;
  }
}



void event(const char* data, size_t length) {
  DynamicJsonDocument data_from_server(1024);
  deserializeJson(data_from_server, data);

   if (data_from_server["hand"] == "onR" && !vibREnabled) {
    digitalWrite(vibR, 1);
    startTimeR = millis();
    vibREnabled = true;
  } else if (data_from_server["hand"] == "onL" && !vibLEnabled) {
    digitalWrite(vibL, 1);
    startTimeL = millis();
    vibLEnabled = true;
  } else if (data_from_server["hand"] == "onBoth") {
    if (!vibREnabled) {
      digitalWrite(vibR, 1);
      startTimeR = millis();
      vibREnabled = true;
    }
    if (!vibLEnabled) {
      digitalWrite(vibL, 1);
      startTimeL = millis();
      vibLEnabled = true;
    }
  }
  
  
}

String reverseString(String str) {
  String reversed = "";
  for (int i = str.length() - 1; i >= 0; i--) {
    reversed += str.charAt(i);
  }
  return reversed;
}
