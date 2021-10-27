#include "wifi.h"
#include "socketio.h"

void setup() {
    Serial.begin(115200);
    delay(250);
    init_wifi();
    init_socket();
}

unsigned long previousmillis = 0; 
void loop() {
    connection_socket();
    unsigned long currentmillis = millis();

    if (currentmillis - previousmillis >= 2000) {
      previousmillis = currentmillis;

      String mensagem = "-20.0000000,-40.0000000,15.00";
      send_socket(String(currentmillis));
    }
    
}
