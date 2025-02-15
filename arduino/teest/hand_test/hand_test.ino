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

int neopixel=13;
int vib =16;
int infraredPin = 13;

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, neopixel, NEO_GRBW + NEO_KHZ800);
int parts_array[] = {0, 2, 6, 10, 14, 18, 24,26,30,34,38,42};
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
  
 


}

void loop() {  

  // //mdns_setup();  
  socket.loop();
   int infraredValue = analogRead(infraredPin);
  
  Serial.print("infraredValue: ");
  Serial.println(infraredValue);

  if (infraredValue>800) {
      Serial.println("vib on");
      digitalWrite(vib,1);

      pixels.clear();
      delay(300);
      for(int i=0; i<13; i++){
        control(i);
        delay(500);
      } 

      DynamicJsonDocument collectedData(1024);
      collectedData["hand"] = "on";
      String jsonData;
      serializeJson(collectedData,jsonData);
      socket.emit(DATA_HEADER,jsonData.c_str());
  }

  else{
      digitalWrite(vib,0);
      delay(10);
      //DynamicJsonDocument collectedData(1024);
      // collectedData["hand"] = "off";
      // String jsonData;
      // serializeJson(collectedData,jsonData);
      // socket.emit(DATA_HEADER,jsonData.c_str());
  }
}
  
  

// Receiving data from  controller
void event(const char * data, size_t length) {
  DynamicJsonDocument data_from_Device(1024);
  deserializeJson(data_from_Device, data);
  Serial.println(data);
}

void control(int p){
      
        int num_start = parts_array[p];
        int num_end = parts_array[p+1];
      
        for(int i=num_start;i<num_end;i++){
          pixels.setPixelColor(i,0,0,0,100);
          pixels.show();
          Serial.println(i);
        }  
  }


