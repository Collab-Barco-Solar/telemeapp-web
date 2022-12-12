#include "wifi.h"
#include "socketio.h"
#include "sensors.h"
#include "dados_mppt.h"
#include <string.h>

String error_mensage = "0.00,0.00,0.00,0.00";
int calibration = 0;

void setup()
{ 
  Serial.begin(19200);
  delay(250);
  init_wifi();
  init_socket();
  init_mppt();
  setupDHT();
  setupADS();
  //delay(1000);
  sensorCalibration();
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
    String result = get_dados_mppt();
    float temperature = get_temperature();
    float humidity = get_humidity();
    float voltage_alimentation = get_font_voltage();
    //float voltage_alimentation = 0;
    float motor_current = get_motor_current();
    float battery_current = get_battery_current();
    int solarArray1_state = get_solarArray1_state();
    int solarArray2_state = get_solarArray2_state();
    
    String all_info = result + "," + String(motor_current) + "," + String(battery_current) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + String(solarArray1_state) + "," + String(solarArray2_state);
//  String all_info = String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;
//  send_socket(all_info);
    Serial.println(all_info);


    //send_socket(String(all_info));
    previousmillis = currentmillis;

    /*if(result != error_mensage && calibration == 0){
     acsCalibration();
     calibration = 1;
    }*/
  }
}
