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

const char* ssid = "AndroidHotspot3475";
const char* password = "10796181";

// const char* ssid = "UXStudio2G";
// const char* password = "123456789id";

// const char* ssid = "CIDR322";
// const char* password = "45184518";
String btn = "aaaaaaaaaaaa";

//multiplexer
int s0 = 2;
int s1 = 12;
int s2 =13;
int s3 = 5;
int SIG_pin = 4;


int vib =14;

void setup() {
  
  socket.begin(HOST_SERVER, PORT); //통신을 뚫겠다
  socket.on(SERVER_NAME, event); // 특정  서버 이름 만 받아오겠다.
  WiFi.begin(ssid, password);
  
  Serial.begin(115200);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
   
  Serial.println("");
  Serial.println("WiFi connected");  
  
  //-----------SocketIO Setting-----------//
  socket.begin(HOST_SERVER, PORT);
  
  
  pinMode(SIG_pin, INPUT);
  pinMode(s0, OUTPUT);
  pinMode(s1, OUTPUT);
  pinMode(s2, OUTPUT);
  pinMode(s3, OUTPUT);
  pinMode(SIG_pin,INPUT_PULLUP);
  pinMode(vib, OUTPUT);

  digitalWrite(s0, LOW);
  digitalWrite(s1, LOW);
  digitalWrite(s2, LOW);
  digitalWrite(s3, LOW);
  //왼쪽부터 123456879 10 12  

}
String current_btn="000000000000";
String previous_btn="000000000000";

long counter;
long current_time;
bool sent;

void loop() {  
  
  socket.loop();
  current_time=millis();

  for(int i = 0; i < 12; i ++){ 
      if(readMux(i)<100){current_btn[i-1] = '1';} else{current_btn[i-1] = '0';} 
  }
  //Serial.println(current_btn);

  //triming data
  String str1=reverseString(current_btn.substring(0,6));
  String str2=current_btn.substring(6); //뒤집기
  String Sending = str2+str1;

  if( current_btn!= previous_btn ){
		counter = millis();
		sent = false;					
	}
  //Serial.println(current_time- counter);
  if(((current_time-counter)>100)&& (sent==false) ){
    DynamicJsonDocument collectedData(1024);
    collectedData["order"] = Sending;
    String jsonData;
    serializeJson(collectedData, jsonData);
    socket.emit(DATA_HEADER, jsonData.c_str());
		sent = true;
	}
  
  previous_btn=current_btn;
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

void event(const char * data, size_t length) {

  DynamicJsonDocument data_from_server(1024);
  deserializeJson(data_from_server, data);

  if(data_from_server["hand"] == "on" ){
    digitalWrite(vib,1);
    delay(500);
    digitalWrite(vib,0);
  }
}

String reverseString(String str) {
  String reversed = "";
  for (int i = str.length() - 1; i >= 0; i--) {
    reversed += str.charAt(i);
  }
  return reversed;
}



