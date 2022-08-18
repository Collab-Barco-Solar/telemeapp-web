#include "wifi.h"
#include "socketio.h"
#include "sensors.h"


void setup()
{
  Serial.begin(115200);
  delay(250);
  init_wifi();
  init_socket();
  setupDHT();
  setupADS();
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

    float current_mppt = get_mppt_current(); // Check
    //float current_alimentation = get_font_current();
    float current_alimentation = 123456; // Valor aleatório pois na nova placa não será utilizado a porta A1 que media a corrente da fonte
    float voltage_batteries = get_battery_voltage(); //Check
    float current_motor = get_motor_current(); //Check
    float temperature = get_temperature(); //Check
    float humidity = get_humidity(); //Check
    //float voltage_alimentation = get_font_voltage();
    float voltage_alimentation = 123456; //Check
    String gps = ""; //Check
    float voltage_mppt = get_mppt_voltage(); //Check
    

    String all_info = String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps + "," + String(voltage_mppt);
    send_socket(all_info);
    Serial.println(all_info);
    previousmillis = currentmillis;
  }
}
