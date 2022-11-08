#include "wifi.h"
#include "socketio.h"
#include "sensors.h"
#include "dados_mppt.h"
#include <string.h>


void setup()
{
  Serial.begin(19200);
  delay(250);
  init_wifi();
  init_socket();
  init_mppt();
  setupDHT();
  setupADS();
}

//Corrente mppt / Corrente Alimentação / Tensão Baterias / Corrente Motor / Temperatura / Umidade /
//Tensão Alimentação / GPS (Latitude, Longitude e Velocidade)

unsigned long previousmillis = 0;
void loop()
{
  //connection_socket();
  unsigned long currentmillis = millis();

  if (currentmillis - previousmillis >= 1000)
  {
    //String result = String(dms.tensao_bateria) + "," + String(dms.corrente_carregamento) + "," + String(dms.energia_painel) + "," + String(dms.rendimento_hoje);
    String result = get_dados_mppt();
    float temperature = get_temperature();
    float humidity = get_humidity();
    float voltage_alimentation = get_font_voltage();

    String all_info = result + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation);
//  String all_info = String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;
//    send_socket(all_info);
    Serial.println(all_info);

    //send_socket(String(all_info));
    previousmillis = currentmillis;
  }
}
