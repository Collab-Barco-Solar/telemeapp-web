#ifndef __SENSORS_H__
#define __SENSORS_H__

#include <Arduino.h>
#include <Adafruit_ADS1X15.h>
//#include <MCP3221.h>
#include <DHT.h>
 

//I2C
// datasheet https://www.filipeflop.com/img/files/download/Datasheet_ADC_ads1115.pdf
#define I2C_ADS1115  0x48  // Endereco do medidor ADC da bateria A0 - Batery Bank voltage // A1 - PV modules voltage

//ADS read
#define LIMIT_GAIN_ONE 4096.0
#define LIMIT_GAIN_TWO_THIRDS 6144.0
#define RESOLUTION_16BIT 65536.0
#define ADS1115_MOTOR_CURRENT 0 //HSTS016L 100A - CORRENTE DO MOTOR
#define ADS1115_BATTERY_CURRENT 1 //HSTS016L 150A - CORRENTE QUE SAI DO BANCO DE BATERIAS
#define ADS1115_FONT_VOLTAGE 2 //TENSAO DE ALIMENTACAO DO ESP32
#define ADS1115_MPPT 3 //PORTA VAZIA

//Constants
#define ESP_MAXIMUM_VOLTAGE_IN 3.3
#define ACS712_OUTPUT_SENSITIVITY 66.0 // 66 mV/A - https://www.allegromicro.com/~/media/files/datasheets/acs712-datasheet.ashx
#define ACS712_VCC 5.0
#define DHTTYPE DHT11 // DHT 11
#define HSTS016L_NOMINAL_CURRENT 100.0
#define HSTS016L_VARIATION 0.625 


//Esp pins
#define PIN_ACS_1 4
#define PIN_ACS_2 5
//#define PIN_12V_VM 35
#define PIN_DHT 18 // pino que estamos conectado

//Corrente MPPT / Corrente Alimentação / Tensão Baterias / Corrente Motor / Temperatura / Umidade / Tensão Alimentação / GPS

float get_motor_current();
float get_battery_current();
float get_font_voltage();

int get_solarArray1_state();
int get_solarArray2_state();

float get_font_current();
float get_mppt_current();

float get_temperature();
float get_humidity();
void setupDHT();
void setupADS();

#endif
