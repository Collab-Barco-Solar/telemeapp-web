#include "sensors.h"

Adafruit_ADS1115 ads_1115(I2C_ADS1115);

DHT dht(PIN_DHT, DHTTYPE);


float get_battery_voltage(){
  ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

  int16_t result = ads_1115.readADC_SingleEnded(ADS1115_BATTERY);
  float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

  //Find voltage before voltage divider
  float R1 = 330000.0, R2 = 15000.0;  
  
  return voltageRead * (R1 + R2)/R2;
}

float get_font_voltage(){
    int bitsRead = analogRead(PIN_12V_VM);
    float voltageRead = bitsRead * ESP_MAXIMUM_VOLTAGE_IN / 1023.0;  //Convert from bits to the float number representing the voltage read

    //Find voltage before voltage divider
    float R1 = 47000.0, R2 = 10000.0;

    return voltageRead * (R1 + R2)/R2;
}

float get_font_current(){ //Verificar a necessidade de fazer várias leituras e pegar a maior ou a média
    ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

    int16_t result = ads_1115.readADC_SingleEnded(ADS1115_FONT_CURRENT);
    float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

    //Convert the voltage to the current in the ACS712
    return (voltageRead - ACS712_VCC/2.0)*1000.0/ACS712_OUTPUT_SENSITIVITY;
}

float get_mppt_current(){ //Verificar a necessidade de fazer várias leituras e pegar a maior ou a média
    ads_1115.setGain(GAIN_TWOTHIRDS);        // 2/3 gain   +/- 6.144V  0.1875mV

    int16_t result = ads_1115.readADC_SingleEnded(ADS1115_MPPT);
    float voltageRead = result*(2*LIMIT_GAIN_TWO_THIRDS/(RESOLUTION_16BIT - 1.0))/1000.0; 
  
    //Convert the voltage to the current in the ACS712
    return (voltageRead - ACS712_VCC/2.0)*1000.0/ACS712_OUTPUT_SENSITIVITY;
}

float get_motor_current(){
    ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

    int16_t result = ads_1115.readADC_SingleEnded(ADS1115_MOTOR_CURRENT
    float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

    float hallAmps = 0;
    if (voltageRead > 2.5)
        hallAmps = (voltageRead - 2.5) * (HSTS016L_NOMINAL_CURRENT / HSTS016L_VARIATION);
    else if (voltageRead < 2.5)
        hallAmps = (2.5 - voltageRead) * (HSTS016L_NOMINAL_CURRENT / HSTS016L_VARIATION);
    return hallAmps;
}

float get_temperature(){
  return dht.readTemperature();
}

float get_humidity(){
  return dht.readHumidity();
}

void setupDHT(){
  dht.begin();
}

void setupADS(){
    ads_1115.begin();
}
