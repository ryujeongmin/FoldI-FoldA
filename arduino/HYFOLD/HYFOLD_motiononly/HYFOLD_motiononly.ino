#define PROTOTYPE_NAME "FoldA"
#define SERVER_NAME "toFoldA"
#define HOST_SERVER "192.168.0.10"
#define PORT 8888

#include <SocketIoClient.h>
#include <ArduinoJson.h>


SocketIoClient socket;

// const char* ssid = "UXStudio5G";
// const char* password = "123456789id";
// const char* ssid = "AndroidHotspot3475";
// const char* password = "10796181";
const char* ssid = "cidrwifi";
const char* password = "cidr4558";
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>



// Set the PCA9685 address
#define PCA9685_ADDRESS 0x40

// Create an instance of the Adafruit_PWMServoDriver class
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(PCA9685_ADDRESS);

// Servo configuration
#define SERVO_MIN_PULSE_WIDTH 150  // Minimum servo pulse width
#define SERVO_MAX_PULSE_WIDTH 600  // Maximum servo pulse width
#define SERVO_MIN_ANGLE 20         // Minimum servo angle (in degrees)
#define SERVO_MAX_ANGLE 200        // Maximum servo angle (in degrees)




int armR = 0;
int shoulderR = 1;

int head = 4;
int neck = 5;

int shoulderL = 6;
int armL = 7;

int head_ready_angle = 180;

int shoulderR_angle = 170;
int ShoulderRangle_m = 15;

int shoulderL_angle = 0;
int armL_angle_ready = 0;




void setup() {

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
  socket.on(SERVER_NAME, event);    // 특정  서버 이름 만 받아오겠다.
  socket.begin(HOST_SERVER, PORT);  //통신을 뚫겠다


  pwm.begin();
  // Set the PWM frequency (default is 50 Hz)
  pwm.setPWMFreq(50);
  Serial.begin(115200);
  ready_start();
}

void loop() {
  socket.loop();
}







long preNeck = 99.00;
long preHead = 180.00;

// Receiving data from web
void event(const char* data, size_t length) {
  DynamicJsonDocument data_from_server(1024);
  deserializeJson(data_from_server, data);

  Serial.println(data);

  if (data_from_server["type"] == "pointing_left") {

    int angleX = int(data_from_server["x"]);
    moveServo(armL, angleX);

    int angleY = int(data_from_server["y"]);
    moveServo(shoulderL, angleY);

    Serial.print("pointing_left : ");
    Serial.print(angleX);
    Serial.print(" , ");
    Serial.println(angleY);

  }

  else if (data_from_server["type"] == "pointing_right") {

    int angleX = int(data_from_server["x"]);
    moveServo(armR, angleX);

    int angleY = int(data_from_server["y"]);
    moveServo(shoulderR, angleY);

    Serial.print("pointing_right : ");
    Serial.print(angleX);
    Serial.print(" , ");
    Serial.println(angleY);

  }
else if (data_from_server["type"] == "head") {
  long horizontal = long(data_from_server["h"]);
  long vertical = long(data_from_server["v"]);

  int angleNeck = preNeck - horizontal;
  int angleHead = preHead - vertical;

  // 범위를 벗어나는 각도를 조정
  angleNeck = max(min(angleNeck, 200), 0); // 0과 180 사이로 각도를 제한
  angleHead = max(min(angleHead, 200), 140); // 0과 125 사이로 각도를 제한

  moveServo(neck, angleNeck);
  moveServo(head, angleHead);

  Serial.print("head : ");
  Serial.print(angleNeck);
  Serial.print(" , ");
  Serial.println(angleHead);

  preNeck = angleNeck;
  preHead = angleHead;
}



  //width
  else if (data_from_server["type"] == "left_width") {

    int angleX = int(data_from_server["x"]);
    moveServo(armL, angleX);

    Serial.print("armL : ");
    Serial.println(angleX);
    //delay(300);
  }

  else if (data_from_server["type"] == "right_width") {

    int angleX = int(data_from_server["x"]);
    moveServo(armR, angleX);

    Serial.print("armR : ");
    Serial.println(angleX);

  }

  //height
  else if (data_from_server["type"] == "left_height") {

    int angleY = int(data_from_server["y"]);
    moveServo(shoulderL, angleY);

    Serial.print("shoulderL : ");
    Serial.println(angleY);

  }

  else if (data_from_server["type"] == "right_height") {

    int angleY = int(data_from_server["y"]);
    moveServo(shoulderR, angleY);

    Serial.print("shoulderR : ");
    Serial.println(angleY);

  }

  //btn LEFT
  else if (data_from_server["type"] == "up_btn_left") {
    moveServo(armL, 90);
    moveServo(shoulderL, 0);

    Serial.println("up_btn_left");
    ;
  }

  else if (data_from_server["type"] == "middle_btn_left") {
    moveServo(armL, 90);
    moveServo(shoulderL, 90);

    Serial.println("middle_btn_left");

  }


  else if (data_from_server["type"] == "down_btn_left") {
    moveServo(armL, 90);
    moveServo(shoulderL, 160);

    Serial.println("down_btn_left");

  }

  //BTN RIGHT
  else if (data_from_server["type"] == "up_btn_right") {
    moveServo(armR, 90);
    moveServo(shoulderR, 160);
    Serial.println("up_btn_right");

  }

  else if (data_from_server["type"] == "middle_btn_right") {
    moveServo(armR, 90);
    moveServo(shoulderR, 70);
    Serial.println("middle_btn_right");
  }

  else if (data_from_server["type"] == "down_btn_right") {
    moveServo(armR, 90);
    moveServo(shoulderR, 0);

    Serial.println("down_btn_right");
  }

  //ready normal
  else if (data_from_server["type"] == "position") {
    if (data_from_server["status"] == 0) {
      ready();
    } else if (data_from_server["status"] == 1) {
      normal();
    }
  }

//clapping
  else if (data_from_server["type"] == "clapping") {
    clapping();

    Serial.println("clapping");
  }

}

void ready() {
  moveServo(neck, 99);
  delay(500);

  for (int i = 40; i >= 0; i--)  //각도 천천히 내리고 싶으면 수정!!!!!!!!!!!!!!
  {
    moveServo(head, i);
    delay(20);
  }
  delay(500);

  moveServo(shoulderL, shoulderL_angle);  //shoulderL
  moveServo(shoulderR, shoulderR_angle);  //shoulderR.write(180);
  delay(1000);                            //armR.write(180);
  moveServo(armL, armL_angle_ready);
  delay(1000);
  //armL.write(0);
  moveServo(armR, 178);
  Serial.println("ready position");
}

void ready_start() {
  moveServo(head, 0);
  moveServo(shoulderL, shoulderL_angle);  //shoulderL
  moveServo(armL, armL_angle_ready);      //armL.write(0);
  moveServo(shoulderR, shoulderR_angle);  //shoulderR.write(180);
  moveServo(armR, 178);                   //armR.write(180);
  moveServo(neck, 99);
  Serial.println("ready position");
}

void normal() {
  moveServo(armL, 90);
  moveServo(armR, 90);
  delay(500);

  moveServo(shoulderL, 160);  // shoulderL.write(180);
  moveServo(shoulderR, 0);    // shoulderR.write(0);
  moveServo(neck, 99);
  moveServo(head, 180);  // Head.write(180);
  Serial.println("normal position");
}


void clapping() {
  moveServo(armL, 90);
  moveServo(shoulderL, 90);
  moveServo(armR, 90);
  moveServo(shoulderR, 70);
  

delay(500);
moveServo(armR, 124);
moveServo(armL, 60);  //손뼉 닿음
delay(500);
moveServo(armR,113);
moveServo(armL, 72);  //손뼉 떨어짐

delay(500);
moveServo(armR, 124);
moveServo(armL, 60);  //손뼉 닿음
delay(500);
moveServo(armR,113);
moveServo(armL, 72);  //손뼉 떨어짐

delay(500);
moveServo(armR, 124);
moveServo(armL, 60);  //손뼉 닿음
delay(500);
moveServo(armR,113);
moveServo(armL, 72);  //손뼉 떨어짐

delay(500);
moveServo(armR, 124);
moveServo(armL, 60);  //손뼉 닿음
delay(500);
moveServo(armR,113);
moveServo(armL, 72);  //손뼉 떨어짐



  moveServo(armL, 90);
  moveServo(shoulderL, 90);
  moveServo(armR, 90);
  moveServo(shoulderR, 70);
  delay(500);

  moveServo(armL, 90);
  moveServo(armR, 90);
  delay(100);
  moveServo(shoulderL, 160);  // shoulderL.write(180);
  moveServo(shoulderR, 0);

}

void moveServo(uint8_t servoNum, uint16_t angle) {
  // Calculate the pulse width based on the desired angle
  uint16_t pulseWidth = map(angle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE, SERVO_MIN_PULSE_WIDTH, SERVO_MAX_PULSE_WIDTH);

  // Set the pulse width on the servo channel
  pwm.setPWM(servoNum, 0, pulseWidth);
}
