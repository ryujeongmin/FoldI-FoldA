#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>


// Set the PCA9685 address
#define PCA9685_ADDRESS 0x40

// Create an instance of the Adafruit_PWMServoDriver class
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(PCA9685_ADDRESS);

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
int head_normal_angle = 0;

int shoulderR_angle = 170;
int ShoulderRangle_m = 15;

int shoulderL_angle = 0;
int armL_angle_ready = 0;



void setup() {
  pwm.begin();

  // Set the PWM frequency (default is 50 Hz)
  pwm.setPWMFreq(50);
  Serial.begin(9600);
}
void loop() {
  if (Serial.available() > 0) {
    Serial.print("Say 1 for ready, 2 for normal, 3 for fist_r, 4 for fist_l: ");
    int data = Serial.parseInt();
    Serial.println(data);

    if (data == 1) {
      ready();
    }

    if (data == 2) {
      normal();
    }

    if (data == 3) {
      putyourhandsup();
      normal();
    }

    if (data == 4) {
      tangjin();
      normal();
    }

    if (data == 5) {
      Serial.println("5");
      moveServo(4, 0);
    }

    if (data == 6) {
      Serial.println("6");
      clapping();
    }
  }
}

void ready() {
  for (int i = head_normal_angle; i >= 0; i--)  //각도 천천히 내리고 싶으면 수정!!!!!!!!!!!!!!
  {
    moveServo(head, i);
    delay(10);
  }
  delay(1000);

  moveServo(shoulderL, shoulderL_angle);  //shoulderL
  moveServo(shoulderR, shoulderR_angle);  //shoulderR.write(180);
  delay(500);
  moveServo(armL, 0);    //armL.write(0);
  moveServo(armR, 178);  //armR.write(180);
  Serial.println("ready position");
  moveServo(neck, 90);
}

void ready_start() {
  moveServo(head, 0);
  moveServo(shoulderL, shoulderL_angle);  //shoulderL
  moveServo(armL, 0);                     //armL.write(0);
  moveServo(shoulderR, shoulderR_angle);  //shoulderR.write(180);
  moveServo(armR, 178);                   //armR.write(180);
  moveServo(neck, 90);
  Serial.println("ready position");
}

void normal() {
  moveServo(shoulderL, 160);               // shoulderL.write(180);
  moveServo(armL, 90);                     // armL.write(90);
  moveServo(shoulderR, ShoulderRangle_m);  // shoulderR.write(0);
  moveServo(armR, 90);                     // armR.write(90);
  delay(500);

  moveServo(head, head_normal_angle);  // Head.write(180);
  Serial.println("normal position");
}

void putyourhandsup() {
  moveServo(shoulderL, 178);  // shoulderL.write(180);
  moveServo(armL, 90);        // armL.write(90);
  moveServo(shoulderR, 90);   // shoulderR.write(0);
  moveServo(armR, 90);        // armR.write(90);



  moveServo(shoulderR, 45);            // shoulderR.write(0);
  moveServo(head, head_normal_angle);  // Head.write(180);
  delay(500);
  moveServo(shoulderR, 135);                // shoulderR.write(0);
  moveServo(head, head_normal_angle - 30);  // Head.write(180);
  delay(500);
  moveServo(shoulderR, 45);            // shoulderR.write(0);
  moveServo(head, head_normal_angle);  // Head.write(180);
  delay(500);
  moveServo(shoulderR, 135);                // shoulderR.write(0);
  moveServo(head, head_normal_angle - 30);  // Head.write(180);
  delay(500);
  moveServo(shoulderR, 45);            // shoulderR.write(0);
  moveServo(head, head_normal_angle);  // Head.write(180);
  delay(500);
  moveServo(shoulderR, 135);                // shoulderR.write(0);
  moveServo(head, head_normal_angle - 30);  // Head.write(180);
  delay(500);

  Serial.println("fist_R position");
}

void tangjin() {
  moveServo(shoulderL, 160);  // shoulderL.write(180);
  moveServo(armL, 90);        // armL.write(90);
  moveServo(shoulderR, 20);   // shoulderR.write(0);
  moveServo(armR, 90);        // armR.write(90);
  delay(500);


  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(500);
  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(500);
  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(500);
  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(1000);


  moveServo(shoulderR, 178);  // shoulderL.write(180);
  moveServo(shoulderL, 0);    // shoulderR.write(0);

  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(500);
  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(500);
  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
  delay(500);
  moveServo(armL, 135);  // armL.write(90);
  moveServo(armR, 135);  // armR.write(90);
  delay(500);
  moveServo(armR, 45);  // armL.write(90);
  moveServo(armL, 45);  // armR.write(90);
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




// void ura(){

//   shoulderL.write(0);
//   armL.write(90);
//   shoulderR.write(180);
//   armR.write(90);

//   Serial.println("Ura");
// }

// void yes(){
//   for(int i=0; i<4; i++){
//   Head.write(180);
//   delay(500);
//   Head.write(170);
//   delay(500);
//   }

//   Serial.println("yes");
// }

// void nono(){
//   for(int i=0; i<3; i++){
//   Neck.write(50);
//   delay(500);
//   Neck.write(100);
//   delay(500);
//   }

//   Serial.println("nono");
// }

// void hello(){

//   shoulderL.write(0);
//   delay(500);
//   for(int i=0; i<5; i++){
//   armL.write(95);
//   delay(150);
//   armL.write(85);
//   delay(150);
//   }


//   Serial.println("hello");
// }


void moveServo(uint8_t servoNum, uint16_t angle) {
  // Calculate the pulse width based on the desired angle
  uint16_t pulseWidth = map(angle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE, SERVO_MIN_PULSE_WIDTH, SERVO_MAX_PULSE_WIDTH);

  // Set the pulse width on the servo channel
  pwm.setPWM(servoNum, 0, pulseWidth);
}
