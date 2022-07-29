#ifndef __SOCKETIO_H__
#define __SOCKETIO_H__

#include <Arduino.h>
#include <SocketIoClient.h>

void init_socket();
void connection_socket();
void send_socket(String info);
void event(const char * payload, size_t length);

#endif
