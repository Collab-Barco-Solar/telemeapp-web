#ifndef __SENSORS_H__
#define __SENSORS_H__

#include <Arduino.h>
#include <Adafruit_ADS1015.h>
//#include <MCP3221.h>
#include "DHT.h"
 

//I2C
// datasheet https://www.filipeflop.com/img/files/download/Datasheet_ADC_ads1115.pdf
#define I2C_ADS1115  0x48  // Endereco do medidor ADC da bateria A0 - Batery Bank voltage // A1 - PV modules voltage

//ADS read
#define LIMIT_GAIN_ONE 4.096
#define LIMIT_GAIN_TWO_THIRDS 6.144
#define RESOLUTION_16BIT 65536.0
#define ADS1115_MPPT 0
#define ADS1115_FONT_CURRENT 1
#define ADS1115_MOTOR_CURRENT 2
#define ADS1115_BATTERY 3


//Constants
#define ESP_MAXIMUM_VOLTAGE_IN 3.3
#define ACS712_OUTPUT_SENSITIVITY 66.0 // 66 mV/A - https://www.allegromicro.com/~/media/files/datasheets/acs712-datasheet.ashx
#define ACS712_VCC 5.0
#define DHTTYPE DHT11 // DHT 11
#define HSTS016L_NOMINAL_CURRENT 100.0
#define HSTS016L_VARIATION 0.625 


//Esp pins
#define PIN_12V_VM 35
#define PIN_DHT 0 // pino que estamos conectado

//Corrente MPPT / Corrente Alimentação / Tensão Baterias / Corrente Motor / Temperatura / Umidade / Tensão Alimentação / GPS


float get_battery_voltage();
float get_font_voltage();
float get_font_current();
float get_mppt_current();
float get_motor_current();
float get_temperature();
float get_humidity();
void setupDHT();
void setupADS();

#endif
