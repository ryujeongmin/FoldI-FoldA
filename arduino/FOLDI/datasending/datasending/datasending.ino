// Change this to your unique names
#define PROTOTYPE_NAME "FoldI"
#define SERVER_NAME "toFoldI"
#define DATA_HEADER "fromFoldI"
// Change this to your server PC IP
#define HOST_SERVER "143.248.109.60"
#define PORT 8888

#include <SocketIoClient.h>
#include <ArduinoJson.h>


SocketIoClient socket;

const char* ssid = "CIDR322";
const char* password = "45184518";

// const char* ssid = "CIDR322";
// const char* password = "45184518";
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
  //왼쪽부터 123456879 10 12  

}

String current_btn="000000";
String previous_btn="000000";

long counter;
long current_time;
bool sent;

void loop() {  
  current_time=millis();
  for (int i = 0; i < 6; i++) { 
      if (readMux(i) < 100) {
        current_btn[i] = '1';
      } else {
        current_btn[i] = '0';
      }
  }
  //Serial.println(current_btn);

  if( current_btn!= previous_btn ){
		counter = millis();
		sent = false;					
	}
  //Serial.println(current_time- counter);
  if(((current_time-counter)>300)&& (sent==false) ){
    Serial.println(current_btn);
    DynamicJsonDocument collectedData(1024);
    collectedData["order"] = current_btn;
    String jsonData;
    serializeJson(collectedData, jsonData);
    socket.emit(DATA_HEADER, jsonData.c_str());
		sent = true;
	}
  
  previous_btn=current_btn;
    
    // if (currentTotal != previousTotal) { // 값이 변했을 때만 실행
    //   Serial.println(btn);
    //   DynamicJsonDocument collectedData(1024);
    //   collectedData["order"] = btn;
    //   String jsonData;
    //   serializeJson(collectedData, jsonData);
    //   socket.emit(DATA_HEADER, jsonData.c_str());
      
    // }
    // previousTotal = currentTotal;
    
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





