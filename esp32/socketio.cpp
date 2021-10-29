#include "socketio.h"

SocketIoClient socket;

// inicializa o socket.io-client
void init_socket(){
  socket.begin("192.168.183.6",4000);

  //Usa essa funcao caso queira receber algo do servidor socket
//  socket.on("info", event);
  delay(500);
}

void connection_socket(){
  socket.loop();
}

// envia uma mensagem para o servidor via socket
void send_socket(String info){
  char msg[300];
  String infoTosend = "\"" + info + "\"";

  infoTosend.toCharArray(msg, 300);
  
  socket.emit("newinfo", msg);
}


// Recebe algo do servidor
void event(const char * payload, size_t length){
  Serial.printf("got message: %s\n", payload);
}
