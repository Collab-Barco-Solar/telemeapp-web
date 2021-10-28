#include "wifi.h"
#include "socketio.h"

void setup()
{
  Serial.begin(115200);
  delay(250);
  init_wifi();
  init_socket();
}


//Corrente MPPT / Corrente Alimentação / Tensão Baterias / Corrente Motor / Temperatura / Umidade /
//Tensão Alimentação / GPS (Latitude, Longitude e Velocidade)


unsigned long previousmillis = 0;
void loop()
{
  connection_socket();
  unsigned long currentmillis = millis();


  if (currentmillis - previousmillis >= 1000)
  {
    previousmillis = currentmillis;

    float current_mppt = get_mppt_current();
    float current_alimentation = get_font_current();
    float voltage_batteries = get_battery_voltage();
    float current_motor = get_motor_current();
    float temperature = get_temperature();
    float humidity = get_humidity();
    float voltage_alimentation = get_font_voltage();
    String gps = get_gps_info();

    String all_info = String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;
    send_socket(all_info);

    // String mensagem = "-20.0000000,-40.0000000,15.00";
    // send_socket(String(currentmillis));
  }
}