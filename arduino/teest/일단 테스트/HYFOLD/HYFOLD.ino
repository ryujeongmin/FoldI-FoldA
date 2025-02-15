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
int vib =16;
int infraredPin = 13;

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, neopixel, NEO_GRBW + NEO_KHZ800);
int parts_array[] = {0, 2, 6, 10, 14, 18, 24,26,30,34,38,42};
int shoulderL = 1;  
int armL = 0;     

int shoulderR= 4; 
int armR = 5; 

int head = 3;
int neck =2;


int head_normal_angle = 165;
int shoulderR_angle = 175;
int shoulderL_angle = 10;
int ShoulderRangle_m = 15;

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
  int infraredValue = analogRead(infraredPin);
  
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

  Serial.println(data);

    if(data_from_server["type"] == "pointing_left") {
      
      int angleX = int(data_from_server["x"]);
      moveServo(armL,angleX);

      int angleY = int(data_from_server["y"]);
      moveServo(shoulderL, angleY);
 
    } 

    else if(data_from_server["type"] == "pointing_right") {
      
      int angleX = int(data_from_server["x"]);
      moveServo(armR,angleX);

      int angleY = int(data_from_server["y"]);
      moveServo(shoulderR, angleY);

     
    } 

    else if(data_from_server["type"] == "head") {
      
      int horizontal = int(data_from_server["h"]);
      moveServo(neck, horizontal);

      int vertical = int(data_from_server["v"]);
      moveServo(head, vertical);

      Serial.print("head : ");Serial.print(horizontal); Serial.print(" , ");Serial.println(vertical);
     
    } 
    
    //width
     else if(data_from_server["type"] == "left_width") {
      
      int angleX = int(data_from_server["x"]);
      moveServo(armL,angleX);

      Serial.print("armL : ");Serial.println(angleX);
     //delay(300);
    } 

    else if(data_from_server["type"] == "right_width") {
      
      int angleX = int(data_from_server["x"]);
      moveServo(armR,angleX);

      Serial.print("armR : ");Serial.println(angleX);
      
    } 

    //height
    else if(data_from_server["type"] == "left_height") {
      
      int angleY = int(data_from_server["y"]);
      moveServo(shoulderL,angleY);

      Serial.print("shoulderL : ");Serial.println(angleY);
      
    } 

    else if(data_from_server["type"] == "right_height") {
      
      int angleY = int(data_from_server["y"]);
      moveServo(shoulderR,angleY);

      Serial.print("shoulderR : ");Serial.println(angleY);
      
    } 

    //btn LEFT
    else if(data_from_server["type"] == "up_btn_left") {
      moveServo(armL,90);
      moveServo(shoulderL,0);

      Serial.println("up_btn_left");
      ;
    } 

    else if(data_from_server["type"] == "middle_btn_left") {
      moveServo(armL,90);
      moveServo(shoulderL,90);

      Serial.println("middle_btn_left");
      
    } 
    
    
    else if(data_from_server["type"] == "down_btn_left") {
      moveServo(armL,90);
      moveServo(shoulderL,160);

      Serial.println("down_btn_left");
      
    } 

//BTN RIGHT
     else if(data_from_server["type"] == "up_btn_right") {
      moveServo(armR,90);
      moveServo(shoulderR,180);

      Serial.println("up_btn_right");
      
    } 

    else if(data_from_server["type"] == "middle_btn_right") {
      moveServo(armR,90);
      moveServo(shoulderR,90);

      Serial.println("middle_btn_right");
    } 

    else if(data_from_server["type"] == "down_btn_right") {
      moveServo(armR,90);
      moveServo(shoulderR,ShoulderRangle_m);

      Serial.println("down_btn_right");
    } 

    //ready normal
    else if(data_from_server["type"] == "position") {
      if(data_from_server["status"]==0){ready();}
      else if(data_from_server["status"]==1){normal();}
    } 

 
//neopixel
   if (int(data_from_server["order"])==0) {pixels.clear(); control(5);}
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

void ready(){
  for(int i=head_normal_angle;i>=0;i--) //각도 천천히 내리고 싶으면 수정!!!!!!!!!!!!!!
  {moveServo(head,i); delay(10);}
  delay(1000);

  moveServo(shoulderL,shoulderL_angle); //shoulderL
  moveServo(shoulderR, shoulderR_angle); //shoulderR.write(180);
  delay(500);
  moveServo(armL,0);//armL.write(0);
  moveServo(armR,172); //armR.write(180);
  Serial.println("ready position");
  moveServo(neck,90);
}

void ready_start(){
  moveServo(head,0);
  moveServo(shoulderL,shoulderL_angle); //shoulderL
  moveServo(armL,0);//armL.write(0);
  moveServo(shoulderR,shoulderR_angle); //shoulderR.write(180);
  moveServo(armR,172); //armR.write(180);
  moveServo(neck,90); 
  Serial.println("ready position");
}

void normal(){
  moveServo(shoulderL,160); // shoulderL.write(180);
  moveServo(armL,90);// armL.write(90);
  moveServo(shoulderR,ShoulderRangle_m);// shoulderR.write(0);
  moveServo(armR,90);// armR.write(90);
  delay(500);

  moveServo(head,head_normal_angle);// Head.write(180);
  Serial.println("normal position");
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

   
  

void moveServo(uint8_t servoNum, uint16_t angle) {
  // Calculate the pulse width based on the desired angle
  uint16_t pulseWidth = map(angle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE, SERVO_MIN_PULSE_WIDTH, SERVO_MAX_PULSE_WIDTH);
  
  // Set the pulse width on the servo channel
  pwm.setPWM(servoNum, 0, pulseWidth);
}


