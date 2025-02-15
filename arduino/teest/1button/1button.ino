int array[]={13, 12, 27, 5, 15, 18, 14, 22, 23, 19, 16, 17,32,33};
int vib = 4;


String current_btn = "00000000000000";

void setup(){
  for(int i=0; i<14; i++){
    pinMode(array[i], INPUT_PULLUP
    );
  }
  Serial.begin(115200);
  pinMode(vib,OUTPUT);
}



void loop(){
 for (int i = 0; i < 12; i++) {
    if (digitalRead(array[i]) == 0) {
      current_btn[i] = '1';
    } else {
      current_btn[i] = '0';
    }
  }

  for(int i = 12; i < 14; i ++){    
      current_btn[i]=char(int(9-(analogRead(array[12]))/455)+48);
  }

Serial.println(current_btn);
}
  

