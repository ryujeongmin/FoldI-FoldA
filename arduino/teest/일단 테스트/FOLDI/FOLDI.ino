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
String btn = "aaaaaaaaaaaa";
int hand_state = 0;


int previousTotal = 0;
//multiplexer
int s0 = 14;
int s1 = 16;
int s2 =15;
int s3 = 0;
int SIG_pin = 4;

int vibR=13;
int vibL=12;

int total=0;
int after=0;

void setup() {
  
  
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
   
  Serial.println("");
  Serial.println("WiFi connected");  
  
  //-----------SocketIO Setting-----------//
  socket.on(SERVER_NAME, event); //받는 데이터를 event함수 내에서 처리
  socket.begin(HOST_SERVER, PORT);
  
  
  pinMode(SIG_pin, INPUT);
  pinMode(s0, OUTPUT);
  pinMode(s1, OUTPUT);
  pinMode(s2, OUTPUT);
  pinMode(s3, OUTPUT);
  pinMode(SIG_pin,INPUT_PULLUP);
  pinMode(vibR, OUTPUT);
  pinMode(vibL, OUTPUT);

  digitalWrite(s0, LOW);
  digitalWrite(s1, LOW);
  digitalWrite(s2, LOW);
  digitalWrite(s3, LOW);
  
  digitalWrite(vibR, LOW);
  digitalWrite(vibL, LOW);
  
  //왼쪽부터 123456879 10 12  

}
void loop() {  
  socket.loop();
  
  int currentTotal = 0;
  for (int i = 0; i < 12; i++) { 
    if (readMux(i + 1) < 100) {
      btn[i] = '1';
      currentTotal += 1; // 문자 '1'을 정수로 변환하여 합산
    } else {
      btn[i] = '0';
    }
  }
  
 if (currentTotal != previousTotal) { // 값이 변했을 때만 실행
    // Serial.print("Current Total: ");
    // Serial.println(currentTotal);

    if(currentTotal!=0)
    {
      if(btn=="000000000001")
      {hand_state=0; Serial.println("0");}
      else if(btn=="000000110000" or "000000100000")
      {hand_state=1;Serial.println("1");}
      else if(btn=="100000111110"or"000000111110")
      {hand_state=2;}Serial.println("2");
      
      DynamicJsonDocument collectedData(1024);
      collectedData["order"] =hand_state;
      String jsonData;
      serializeJson(collectedData, jsonData);
      socket.emit(DATA_HEADER, jsonData.c_str());
      
    }

    previousTotal = currentTotal;
  }
}




// Receiving data from web
void event(const char * data, size_t length) {

  DynamicJsonDocument data_from_server(1024);
  deserializeJson(data_from_server, data);
  Serial.println("event");

  if(data_from_server["hand"] == "on" ){
    //Serial.println("vib on");
    digitalWrite(vibR,1);
    delay(500);
    digitalWrite(vibR,0);
    delay(1);
  }

  else{
    //Serial.println("vib ff");
    digitalWrite(vibR,0);
    delay(500);
  }
    // DynamicJsonDocument collectedData(1024);
    // collectedData["12"]=readMux(12);
    // collectedData["11"]=readMux(11);
    // collectedData["10"]=readMux(10);
    // collectedData["9"]=readMux(9);
    // collectedData["8"]=readMux(8);
    // collectedData["7"]=readMux(7);
    // collectedData["6"]=readMux(6);
    // collectedData["5"]=readMux(5);
    // collectedData["4"]=readMux(4);
    // collectedData["3"]=readMux(3);
    // collectedData["2"]=readMux(2);
    // collectedData["1"]=readMux(1);
    // String jsonData;
    // serializeJson(collectedData,jsonData);
    // socket.emit(DATA_HEADER,jsonData.c_str());
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





