#include "socketio.h"

SocketIOclient socket;

// inicializa o socket.io-client
void init_socket() {
  //  socket.begin("192.168.15.37",4000);
  socket.begin("teleme-server.herokuapp.com", 80);
  socket.onEvent(socketIOEvent);
  //Usa essa funcao caso queira receber algo do servidor socket
  //  socket.on("info", event);
  delay(500);
}

void connection_socket() {
  socket.loop();
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            //Serial.printf("[IOc] Desconectado!\n");
            break;
        case sIOtype_CONNECT:
            Serial.printf("[IOc] Conectado ao url: %s\n", payload);

            // join default namespace (no auto join in Socket.IO V3)
            socket.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
            Serial.println((char *)&payload[0]);           
            break;
        case sIOtype_ERROR:
            Serial.printf("[IOc] get error: %u\n", length);
            hexdump(payload, length);
            break;
    }
}

// envia uma mensagem para o servidor via socket
void send_socket(String info)
{

  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  array.add("newinfo");

  // add payload (parameters) for the event
  JsonObject param1 = array.createNestedObject();
  param1["now"] = info;

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event
  socket.sendEVENT(output);




  //  char msg[300];
  //  String infoTosend = "\"" + info + "\"";
  //
  //  infoTosend.toCharArray(msg, 300);
  //
  ////  socket.sendEVENT("newinfo", msg);
  //  socket.sendEVENT(msg);
}


// Recebe algo do servidor
void event(const char * payload, size_t length) {
  Serial.printf("got message: %s\n", payload);
}
