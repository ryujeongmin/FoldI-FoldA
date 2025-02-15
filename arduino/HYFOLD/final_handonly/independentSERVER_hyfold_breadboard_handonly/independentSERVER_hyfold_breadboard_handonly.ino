#define PROTOTYPE_NAME "HAND"
#define SERVER_NAME "toHAND"
#define DATA_HEADER "fromHAND"
// Change this to your server PC IP
#define HOST_SERVER "192.168.0.5"
#define PORT 8888

#include <SocketIoClient.h>
#include <ArduinoJson.h>

SocketIoClient socket;

// const char* ssid = "CIDR322";
// const char* password = "45184518";
const char* ssid = "cidrwifi";
const char* password = "cidr4558";
// const char* ssid = "UXStudio5G";
// const char* password = "123456789id";

#include <Wire.h>

#include <Adafruit_NeoPixel.h>
#define neopixel 19
//LED
#define neopixel2 17
#define NUM_PIXELS 28
Adafruit_NeoPixel pixels(NUM_PIXELS, neopixel, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel pixels2(NUM_PIXELS, neopixel2, NEO_GRB + NEO_KHZ800);
int parts_array[] = { 0, 6, 12, 18, 24, 28 };

//infrared, vib
int vibR = 21;
int vibL = 16;
int infraPin[] = { 33, A0, 32, A1 };
bool current_inf[4] = { false, false, false, false };
bool previous_inf[4] = { false, false, false, false };
long counter;
long current_time;
bool touch = false;

bool anyLeft = false;
bool anyRight = false;

bool leftButtonPressed = false;
bool rightButtonPressed = false;

bool status = false;

void setup() {
  pinMode(vibL, OUTPUT);
  pinMode(vibR, OUTPUT);
  for (int i = 0; i < 4; i++) {
    pinMode(infraPin[i], INPUT);
  }

  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");

  // socket.on(SERVER_NAME, event);
  // socket.begin(HOST_SERVER);

  //-----------SocketIO Setting-----------//

  socket.begin(HOST_SERVER, PORT);  // 통신을 뚫겠다
  socket.on(SERVER_NAME, event);    // 특정 서버 이름 만 받아오겠다.

  pixels.begin();
  pixels2.begin();
  for (int i = 0; i < 50; i++) {
    pixels.setPixelColor(i, 100, 100, 100);
    pixels.show();
    Serial.println(i);
  }

  for (int i = 0; i < 50; i++) {
    pixels2.setPixelColor(i, 100, 100, 100);
    pixels2.show();
    Serial.println(i);
  }
  delay(1000);
  pixels.clear();
  pixels.show();
  pixels2.clear();
  pixels2.show();
}

bool readStableInput(int pin) {
  int hitCount = 0;
  for (int i = 0; i < 5; i++) {
    if (digitalRead(pin) == HIGH) {
      hitCount++;
    }
  }
  return (hitCount >= 3);  // 3번 중 2번 이상 HIGH가 감지되면 true 반환
}

void loop() {
  socket.loop();
  if (status) {

    current_time = millis();  // 현재 시간 갱신
    bool stateChanged = false;

    for (int i = 0; i < 4; i++) {
      bool sensorValue = readStableInput(infraPin[i]);
      if (sensorValue != current_inf[i]) {
        stateChanged = true;
        current_inf[i] = sensorValue;
      }
    }

    if (stateChanged) {  // 이전 상태와 현재 상태 비교
      counter = millis();
      touch = false;
    }

    anyLeft = current_inf[0] || current_inf[1];
    anyRight = current_inf[2] || current_inf[3];

    if (anyLeft && leftButtonPressed) {
      digitalWrite(vibL, HIGH);
      delay(1500);
      digitalWrite(vibL, LOW);
    }

    if (anyRight && rightButtonPressed) {
      digitalWrite(vibR, HIGH);
      delay(1500);
      digitalWrite(vibR, LOW);
    }

    if (((current_time - counter) > 100) && !touch) {
      for (int i = 0; i < 4; i++) {
        Serial.print(current_inf[i] ? '1' : '0');
      }
      Serial.println();

      if (anyLeft) {
        Serial.println("leftvib");
        DynamicJsonDocument collectedData(1024);
        collectedData["hand"] = "onL";
        String jsonData;
        serializeJson(collectedData, jsonData);
        socket.emit(DATA_HEADER, jsonData.c_str());
      }
      Serial.print("leftButtonPressed in loop: ");
      Serial.println(leftButtonPressed);
      
      if (anyRight) {
        Serial.println("rightvib");
        DynamicJsonDocument collectedData(1024);
        collectedData["hand"] = "onR";
        String jsonData;
        serializeJson(collectedData, jsonData);
        socket.emit(DATA_HEADER, jsonData.c_str());
      }
      Serial.print("rightButtonPressed in loop: ");
      Serial.println(rightButtonPressed);
      
      if (anyLeft && anyRight) {
        Serial.println("vibOnBoth");
        DynamicJsonDocument collectedData(1024);
        collectedData["hand"] = "onBoth";
        String jsonData;
        serializeJson(collectedData, jsonData);
        socket.emit(DATA_HEADER, jsonData.c_str());
      }

      touch = true;
    }
  }
}

// Receiving data from the web
void event(const char* data, size_t length) {
  DynamicJsonDocument data_from_server(1024);
  deserializeJson(data_from_server, data);

  pixels.clear();
  pixels2.clear();

  if (data_from_server["order"]) {
    const char* btn = data_from_server["order"];
    char* btn_a = strdup(btn);
    Serial.println(btn_a);

    // Check for left button press
    if (btn[0] == '1') {
      leftButtonPressed = true;
    } else {
      leftButtonPressed = false;
    }
    Serial.print("leftButtonPressed set to: ");
    Serial.println(leftButtonPressed);

    // Check for right button press
    if (btn[11] == '1') {  // Assuming btn[1] represents the right button
      rightButtonPressed = true;
    } else {
      rightButtonPressed = false;
    }
    Serial.print("rightButtonPressed set to: ");
    Serial.println(rightButtonPressed);

    int currentTotal = 0;
    for (int i = 0; i < 6; i++) {
      if (btn_a[i] == '1') {
        control1(i);
        currentTotal = currentTotal + 1;
      }
    }
    for (int i = 6; i < 12; i++) {
      if (btn_a[i] == '1') {
        control2(i);
        currentTotal = currentTotal + 1;
      }
    }

    if (btn_a[12] != '0') {
      controlSliderL(int(btn_a[12]) - 49);  // 왼쪽
      currentTotal = currentTotal + 1;
    } else if (btn_a[13] != '0') {
      controlSliderR(int(btn_a[13]) - 49);  // 오른쪽
      currentTotal = currentTotal + 1;
    }

    if (currentTotal == 0) {
      pixels.clear();
      pixels.show();
      pixels2.clear();
      pixels2.show();
      Serial.println("clear");
    }
  }

  if (data_from_server["status"]) {
    Serial.print("received");
    const char* status1 = data_from_server["status"];
    if (strcmp(status1, "1") == 0) {
      Serial.println("true");
      status = true;
    } else if (strcmp(status1, "0") == 0) {
      Serial.println("false");
      status = false;
    }
    Serial.println(status1);
  }
}

void control1(int p) {
  if (p == 0) {
    for (int i = 0; i < int(sizeof(parts_array) / sizeof(parts_array[0])) - 1; i++) {
      pixels.setPixelColor(parts_array[i], 100, 100, 100);
      pixels.setPixelColor(parts_array[i + 1] - 1, 100, 100, 100);
      pixels.show();
    }
  } else {
    int num_start = parts_array[p - 1];
    int num_end = parts_array[p];

    for (int i = num_start; i < num_end; i++) {
      pixels.setPixelColor(i, 100, 100, 100);
      pixels.show();
    }
  }
}

void control2(int t) {
  int p = t - 6;  // 오른손 함수와 동일하게 사용가능 0~5
  if (p == 5) {
    for (int i = 0; i < int(sizeof(parts_array) / sizeof(parts_array[0])) - 1; i++) {
      pixels2.setPixelColor(parts_array[i], 100, 100, 100);
      pixels2.setPixelColor(parts_array[i + 1] - 1, 100, 100, 100);
      pixels2.show();
    }
  } else {
    int num_start = parts_array[4 - p];  // 좌우대칭
    int num_end = parts_array[5 - p];

    for (int i = num_start; i < num_end; i++) {
      pixels2.setPixelColor(i, 100, 100, 100);
      pixels2.show();
    }
  }
}

void controlSliderL(int x) {
  int lux = 100;

  if (x) {  // 위로
    pixels.clear();
    // 첫째칸
    for (int i = 0; i < 4; i++) {
      pixels.setPixelColor(parts_array[i], lux, lux, lux);
      pixels.setPixelColor(parts_array[i] + 5, lux, lux, lux);
    }
    pixels.show();
    delay(100);
    // 둘째칸
    for (int i = 0; i < 4; i++) {
      pixels.setPixelColor(parts_array[i] + 1, lux, lux, lux);
      pixels.setPixelColor(parts_array[i] + 4, lux, lux, lux);
      pixels.setPixelColor(24, lux, lux, lux);
      pixels.setPixelColor(27, lux, lux, lux);
    }
    pixels.show();
    delay(100);
    // 셋째칸
    for (int i = 0; i < 4; i++) {
      pixels.setPixelColor(parts_array[i] + 2, lux, lux, lux);
      pixels.setPixelColor(parts_array[i] + 3, lux, lux, lux);
      pixels.setPixelColor(25, lux, lux, lux);
      pixels.setPixelColor(26, lux, lux, lux);
    }
    pixels.show();
    delay(100);
    pixels.clear();
    pixels.show();
  } else if (x == 0) {  // 아래로
    for (int i = 0; i < 30; i++) {
      pixels.setPixelColor(i, 100, 100, 100);
    }
    pixels.show();
    delay(100);

    // 셋째칸
    for (int i = 0; i < 4; i++) {
      pixels.setPixelColor(parts_array[i] + 2, 0, 0, 0);
      pixels.setPixelColor(parts_array[i] + 3, 0, 0, 0);
      pixels.setPixelColor(25, 0, 0, 0);
      pixels.setPixelColor(26, 0, 0, 0);
    }
    pixels.show();
    delay(100);

    // 둘째칸
    for (int i = 0; i < 4; i++) {
      pixels.setPixelColor(parts_array[i] + 1, 0, 0, 0);
      pixels.setPixelColor(parts_array[i] + 4, 0, 0, 0);
      pixels.setPixelColor(24, 0, 0, 0);
      pixels.setPixelColor(27, 0, 0, 0);
    }
    pixels.show();
    delay(100);

    // 첫째칸
    for (int i = 0; i < 4; i++) {
      pixels.setPixelColor(parts_array[i], 0, 0, 0);
      pixels.setPixelColor(parts_array[i] + 5, 0, 0, 0);
    }
    pixels.show();
    delay(100);
  }
}

void controlSliderR(int x) {
  int lux = 100;

  if (x) {  // 위로
    pixels2.clear();
    // 첫째칸
    for (int i = 0; i < 4; i++) {
      pixels2.setPixelColor(parts_array[i], lux, lux, lux);
      pixels2.setPixelColor(parts_array[i] + 5, lux, lux, lux);
    }
    pixels2.show();
    delay(100);
    // 둘째칸
    for (int i = 0; i < 4; i++) {
      pixels2.setPixelColor(parts_array[i] + 1, lux, lux, lux);
      pixels2.setPixelColor(parts_array[i] + 4, lux, lux, lux);
      pixels2.setPixelColor(24, lux, lux, lux);
      pixels2.setPixelColor(27, lux, lux, lux);
    }
    pixels2.show();
    delay(100);
    // 셋째칸
    for (int i = 0; i < 4; i++) {
      pixels2.setPixelColor(parts_array[i] + 2, lux, lux, lux);
      pixels2.setPixelColor(parts_array[i] + 3, lux, lux, lux);
      pixels2.setPixelColor(25, lux, lux, lux);
      pixels2.setPixelColor(26, lux, lux, lux);
    }
    pixels2.show();

    delay(100);
    pixels2.clear();
    pixels2.show();
  } else if (x == 0) {  // 아래로
    for (int i = 0; i < 30; i++) {
      pixels2.setPixelColor(i, 100, 100, 100);
    }
    pixels2.show();
    delay(100);

    // 셋째칸
    for (int i = 0; i < 4; i++) {
      pixels2.setPixelColor(parts_array[i] + 2, 0, 0, 0);
      pixels2.setPixelColor(parts_array[i] + 3, 0, 0, 0);
      pixels2.setPixelColor(25, 0, 0, 0);
      pixels2.setPixelColor(26, 0, 0, 0);
    }
    pixels2.show();
    delay(100);

    // 둘째칸
    for (int i = 0; i < 4; i++) {
      pixels2.setPixelColor(parts_array[i] + 1, 0, 0, 0);
      pixels2.setPixelColor(parts_array[i] + 4, 0, 0, 0);
      pixels2.setPixelColor(24, 0, 0, 0);
      pixels2.setPixelColor(27, 0, 0, 0);
    }
    pixels2.show();
    delay(100);

    // 첫째칸
    for (int i = 0; i < 4; i++) {
      pixels2.setPixelColor(parts_array[i], 0, 0, 0);
      pixels2.setPixelColor(parts_array[i] + 5, 0, 0, 0);
    }
    pixels2.show();
    delay(100);
  }
}
