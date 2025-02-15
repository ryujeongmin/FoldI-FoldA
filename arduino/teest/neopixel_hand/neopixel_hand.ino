#include <Adafruit_NeoPixel.h>
#define neopixel 17
#define neopixel2 19
#define NUM_PIXELS 28

Adafruit_NeoPixel pixels(NUM_PIXELS, neopixel, NEO_GRB + NEO_KHZ800);
Adafruit_NeoPixel pixels2(NUM_PIXELS, neopixel2, NEO_GRB + NEO_KHZ800);

int parts_array[] = { 0, 6, 12, 18, 24, 28 };


void setup() {
  Serial.begin(115200);
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
}


// bool data_update = true;

void loop() {
  int val = Serial.parseInt();
  if (val < 6) {
    controlR(val);
  }

  else {
    controlL(val);
  }
}


void controlR(int p) {
  pixels.clear();
  pixels2.clear();
  pixels2.show();
  if (p == 5) {
    for (int i = 0; i < int(sizeof(parts_array) / sizeof(parts_array[0])) - 1; i++) {
      pixels.setPixelColor(parts_array[i], 100, 100, 100);
      pixels.setPixelColor(parts_array[i + 1] - 1, 100, 100, 100);
      pixels.show();
      Serial.println(parts_array[i]);
    }
  }

  else {
    int num_start = parts_array[p];
    int num_end = parts_array[p + 1];

    for (int i = num_start; i < num_end; i++) {
      pixels.setPixelColor(i, 100, 100, 100);
      pixels.show();
      Serial.println(i);
    }
  }
}


void controlL(int t) {
  pixels2.clear();
  pixels.clear();
  pixels.show();
  int p = t - 6;  //오른손 함수와 동일하게 사용가능 0~5
  if (p == 5) {
    for (int i = 0; i < int(sizeof(parts_array) / sizeof(parts_array[0])) - 1; i++) {
      pixels2.setPixelColor(parts_array[i], 100, 100, 100);
      pixels2.setPixelColor(parts_array[i + 1] - 1, 100, 100, 100);
      pixels2.show();
      Serial.println(parts_array[i]);
    }
  }

  else {
    int num_start = parts_array[4 - p];  //좌우대칭
    int num_end = parts_array[5 - p];

    for (int i = num_start; i < num_end; i++) {
      pixels2.setPixelColor(i, 100, 100, 100);
      pixels2.show();
      Serial.println(i);

      
    }
  }
}
