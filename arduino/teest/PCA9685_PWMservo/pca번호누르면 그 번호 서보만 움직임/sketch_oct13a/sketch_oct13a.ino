
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

void setup() {
  // Initialize the servo controller
  pwm.begin();
  
  // Set the PWM frequency (default is 50 Hz)
  pwm.setPWMFreq(50);
  Serial.begin(115200);


}

void loop() {
  // // Move the servo to different positions
  // moveServo(0, 0);    // Move servo on channel 0 to the minimum angle
  // delay(1000);
  // // moveServo(0, 90);   // Move servo on channel 0 to the middle angle
  // // delay(1000);
  // moveServo(0, 178);  // Move servo on channel 0 to the maximum angle
  // delay(1000);

  int value = Serial.parseInt();

 
  
    if(value){

    moveServo(4,180);
    delay(3000);
    moveServo(4,00);



    }
   

    
  }





void moveServo(uint8_t servoNum, uint16_t angle) {
  // Calculate the pulse width based on the desired angle
  uint16_t pulseWidth = map(angle, SERVO_MIN_ANGLE, SERVO_MAX_ANGLE, SERVO_MIN_PULSE_WIDTH, SERVO_MAX_PULSE_WIDTH);
  
  // Set the pulse width on the servo channel
  pwm.setPWM(servoNum, 0, pulseWidth);
}
