#define PROTOTYPE_NAME "FoldA"
#define SERVER_NAME "toFoldA"
#define DATA_HEADER "fromFoldA"
// Change this to your server PC IP
#define HOST_SERVER "143.248.109.60"
#define PORT 8888

#include <SocketIoClient.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>

#define NUMPIXELS 48


SocketIoClient socket;

const char* ssid = "CIDR322";
const char* password = "45184518";

#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>


// Set the PCA9685 address
#define PCA9685_ADDRESS 0x40

// Create an instance of the Adafruit_PWMServoDriver class
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(PCA9685_ADDRESS);

// Servo configuration
#define SERVO_MIN_PULSE_WIDTH 150 // Minimum servo pulse width
#define SERVO_MAX_PULSE_WIDTH 600 // Maximum servo pulse width
#define SERVO_MIN_ANGLE 20         // Minimum servo angle (in degrees)
#define SERVO_MAX_ANGLE 200       // Maximum servo angle (in degrees)


int neopixel=14;
// int vib =16;
// int infraredPin = 13;

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, neopixel, NEO_GRBW + NEO_KHZ800);
int parts_array[] = {0, 2, 6, 10, 14, 18, 24,26,30,34,38,42};
// int shoulderL = 1;  
// int armL = 0;     

// int shoulderR= 4; 
// int armR = 5; 

// int head = 3;
// int neck =2;


// int head_normal_angle = 165;
// int shoulderR_angle = 175;
// int shoulderL_angle = 10;
// int ShoulderRangle_m = 15;

void setup() {

  pinMode(neopixel, OUTPUT);
  pinMode(vib, OUTPUT);
  pinMode(infraredPin, INPUT);
  
  
  digitalWrite(vib, LOW);

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
  socket.on(SERVER_NAME, event); // 특정  서버 이름 만 받아오겠다.
  socket.begin(HOST_SERVER, PORT); //통신을 뚫겠다
  
 
  pwm.begin();
  // Set the PWM frequency (default is 50 Hz)
  pwm.setPWMFreq(50);
  Serial.begin(115200);
  ready_start();


for(int i=0; i<13; i++){
  control(i);
  delay(100);
} 
}

void loop() {  
  
  socket.loop();
  //int infraredValue = analogRead(infraredPin);
  
  // Serial.print("infraredValue: ");
  // Serial.println(infraredValue);

  // if (infraredValue>800) {
  //     Serial.println("vib on");
  //     digitalWrite(vib,1);
  //     delay(1500);

  //     DynamicJsonDocument collectedData(1024);
  //     collectedData["hand"] = "on";
  //     String jsonData;
  //     serializeJson(collectedData,jsonData);
  //     socket.emit(DATA_HEADER,jsonData.c_str());

  //     digitalWrite(vib,0);
  //     delay(10);
  // }

  // else{
  //     digitalWrite(vib,0);
  //     delay(10);
  //     //DynamicJsonDocument collectedData(1024);
  //     // collectedData["hand"] = "off";
  //     // String jsonData;
  //     // serializeJson(collectedData,jsonData);
  //     // socket.emit(DATA_HEADER,jsonData.c_str());
  // }
}
  
  







// Receiving data from web
void event(const char * data, size_t length) {
  DynamicJsonDocument data_from_server(1024);
  deserializeJson(data_from_server, data);

  
 
//neopixel
   if (int(data_from_server["order"])==0) 
    {pixels.clear(); control(5);}
   else if (int(data_from_server["order"])==1) {
     pixels.clear(); 
     control(0);
     control(1);
    }
   else if (int(data_from_server["order"])==2) {
    pixels.clear(); 
    control(0);
    control(1);
    control(2);
    control(3);
    control(4);
   }
    
    // else if(data_from_web["type"] == "right") {
    //   Serial.println("rightright");
    //   int angleX = 330-int(data_from_web["x"]); //
    //   //Serial.println(angleX);
    //   moveServo(armR,angleX);

    //   int angleY = int(data_from_web["y"]);
    //   //Serial.println(angleY);
    //   moveServo(shoulderR, angleY);
    //   delay(70);
    // }

    // else if(data_from_web["type"] == "head") {
    //   Serial.println("headhead");
    //   int horizontal = int(data_from_web["h"]);
    //   //Serial.println(angleY);
    //   moveServo(neck, horizontal);
      
    //   int vertical=180-int(data_from_web["v"]);
    //   //Serial.println(angleX);
    //   moveServo(head, vertical);

      
    //   delay(80);
    
}

//neo pixel hand
void control(int p){
      
        int num_start = parts_array[p];
        int num_end = parts_array[p+1];
      
        for(int i=num_start;i<num_end;i++){
          pixels.setPixelColor(i,0,0,0,100);
          pixels.show();
        }  
  }




