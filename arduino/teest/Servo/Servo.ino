#include <Servo.h>

Servo shoulderL;

int shoulderLpin = 9;  
  


int angle1;


void setup() {
  shoulderL.attach(shoulderLpin);
 

  Serial.begin(9600);
}

void loop() {
 
    // Move servo 1 from 0 to 180 degrees
   Serial.println("start");

   
    angle1 = Serial.parseInt();
        Serial.println(angle1);
        shoulderL.write(angle1);
  
    
    delay(300);

    // if(value==2){
    // Serial.print("arm: ");
    // angle2 = Serial.parseInt();
    // if (Serial.read() == '\n') {
    //   Serial.println(angle2);
    //   armL.write((float)angle2);
    // }
    // }
  
}
