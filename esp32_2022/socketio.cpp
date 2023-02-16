#include "socketio.h"

SocketIoClient socket;

// inicializa o socket.io-client
void init_socket(){
  // Se for usar o server hospedado no localhost, precisa colocar no endereço o seu ip local. Para obter isso, vá até o CMD, dê ipconfig e pegue o IPv4. A porta é o que estiver setada
  // no código do servidor, exemplo: socket.begin("192.168.0.18",4000);
  socket.begin("192.168.0.18",4000);
  //socket.begin("telemeserver.herokuapp.com", 80);
  //socket.begin("server-telemeapp.herokuapp.com", 80);

  //Usa essa funcao caso queira receber algo do servidor socket
  //socket.on("info", event);
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
