#include <Adafruit_NeoPixel.h>
#define NUMPIXELS 48
int parts_array[] = {0, 2, 6, 10, 14, 18, 24,26,30,34,38,42};
int neopixel=5;
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, neopixel, NEO_GRBW + NEO_KHZ800);


String btn = "aaaaaa";


int previousTotal = 0;
//multiplexer
int s0 = 2;
int s1 = 12;
int s2 =13;
int s3 = 5;
int SIG_pin = 4;

void setup() {
  
  
  Serial.begin(115200);
  
  
  pinMode(neopixel, OUTPUT);
  
  pinMode(SIG_pin, INPUT);
  pinMode(s0, OUTPUT);
  pinMode(s1, OUTPUT);
  pinMode(s2, OUTPUT);
  pinMode(s3, OUTPUT);
  
  pinMode(SIG_pin,INPUT_PULLUP);
  digitalWrite(s0, LOW);
  digitalWrite(s1, LOW);
  digitalWrite(s2, LOW);
  digitalWrite(s3, LOW);
  
  for (int i = 0; i < 6; i++) {
    control(i);
  }

}


void loop() {  
 
  int currentTotal = 0;
  for (int i = 0; i < 6; i++) { 
    if (readMux(i) < 100) {
      btn[i] = '1';
      currentTotal += 1; // 문자 '1'을 정수로 변환하여 합산
    } else {
      btn[i] = '0';
    }
  }
  
  if (currentTotal != previousTotal) { // 값이 변했을 때만 실행
    Serial.println(btn);
    //Serial.printf("%d",previousTotal); Serial.printf(" "); Serial.printf("%d",currentTotal);
    pixels.clear();
    for(int i=0; i<6;i++)
      {
        if(btn[i]=='1')
        {
        control(i);
        }
      }
    if(currentTotal==0)
    {pixels.clear(); pixels.show(); Serial.println("clear");}
  }
  
  previousTotal = currentTotal;
}



int readMux(int channel)  { 
  int controlPin[] = {s0, s1, s2, s3}; 


  int muxChannel[16][4]={ {0,0,0,0},  
  {1,0,0,0}, //channel 1 
  {0,1,0,0}, //channel 2 
  {1,1,0,0}, //channel 3 
  {0,0,1,0}, //channel 4 
  {1,0,1,0}, //channel 5 
  {0,1,1,0}, //channel 6 
  {1,1,1,0}, //channel 7 
  {0,0,0,1}, //channel 8 
  {1,0,0,1}, //channel 9 
  {0,1,0,1}, //channel 10 
  {1,1,0,1}, //channel 11 
  {0,0,1,1}, //channel 12 
  {1,0,1,1}, //channel 13 
  {0,1,1,1}, //channel 14 
  {1,1,1,1} //channel 15 
  }; 
  //loop through the 4 sig 
  for(int i = 0; i < 4; i ++){ 
    digitalWrite(controlPin[i], muxChannel[channel][i]); 
    } 
    //read the value at the SIG pin 
    int val = analogRead(SIG_pin); //return the value 
    return val; 
}

void control(int p){
      
        int num_start = parts_array[p];
        int num_end = parts_array[p+1];
      
        for(int i=num_start;i<num_end;i++){
          pixels.setPixelColor(i,0,0,0,100);
          pixels.show();
          Serial.println(i);
        }  
  }





