#include "sensors.h"

Adafruit_ADS1115 ads_1115;

DHT dht(PIN_DHT, DHTTYPE);


//####################### FUNÇÕES DE LEITURA DOS DADOS DO ADS1115
float get_motor_current(){
    ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

    int16_t result = ads_1115.readADC_SingleEnded(ADS1115_MOTOR_CURRENT);
    float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

    float hallAmps = 0;
    if (voltageRead > 2.5)
        hallAmps = (voltageRead - 2.5) * (HSTS016L_NOMINAL_CURRENT / HSTS016L_VARIATION);
    else if (voltageRead < 2.5)
        hallAmps = (2.5 - voltageRead) * (HSTS016L_NOMINAL_CURRENT / HSTS016L_VARIATION);
    return hallAmps;
}

float get_battery_current(){
    ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

  int16_t result = ads_1115.readADC_SingleEnded(ADS1115_BATTERY_CURRENT);
  float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

  float hallAmps = 0;
  if (voltageRead > 2.5)
      hallAmps = (voltageRead - 2.5) * (HSTS016L_NOMINAL_CURRENT / HSTS016L_VARIATION);
  else if (voltageRead < 2.5)
      hallAmps = (2.5 - voltageRead) * (HSTS016L_NOMINAL_CURRENT / HSTS016L_VARIATION);
  return hallAmps;
}

float get_font_voltage(){
  ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

  int16_t result = ads_1115.readADC_SingleEnded(ADS1115_FONT_VOLTAGE);
  float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

  //Find voltage before voltage divider
  float R1 = 47000.0, R2 = 15000.0;  
  
  return voltageRead * (R1 + R2)/R2;
}

//####################### LEITURA DOS DADOS DAS ENTRADAS ANALÓGICAS DAS PORTAS 4 E 5 - ACS712 (AINDA NAO MODIFICADO)

int get_solarArray1_state(){
  int bitsRead = analogRead(PIN_ACS_1);
  float voltageRead = bitsRead * ESP_MAXIMUM_VOLTAGE_IN / 4095.0;  //Convert from bits to the float number representing the voltage read
  //Serial.println("Tensão lida alim. : " + String(voltageRead));

  int array_state = 0;

  if (voltageRead > 0.5){
    array_state = 1;
  }

  return array_state;
}

int get_solarArray2_state(){
  int bitsRead = analogRead(PIN_ACS_2);
  float voltageRead = bitsRead * ESP_MAXIMUM_VOLTAGE_IN / 4095.0;  //Convert from bits to the float number representing the voltage read
  //Serial.println("Tensão lida alim. : " + String(voltageRead));

  int array_state = 0;
  float offset = 0.41;
  if ((((voltageRead - ACS712_VCC/2.0)*1000.0/ACS712_OUTPUT_SENSITIVITY) - offset) > 0.1){
    array_state = 1;
  }

  return array_state;
}



//####################### LEITURA...
/*
float get_font_current(){ //Verificar a necessidade de fazer várias leituras e pegar a maior ou a média
    ads_1115.setGain(GAIN_ONE);        // 1x gain   + 4.096V  1 bit = 0.0625

    int16_t result = ads_1115.readADC_SingleEnded(ADS1115_FONT_CURRENT);
    float voltageRead = result*(2*LIMIT_GAIN_ONE/(RESOLUTION_16BIT-1.0))/1000.0; 

    //Convert the voltage to the current in the ACS712
    float offset = 0.41;
    return ((voltageRead - ACS712_VCC/2.0)*1000.0/ACS712_OUTPUT_SENSITIVITY) - offset;
}

float get_mppt_current(){ //Verificar a necessidade de fazer várias leituras e pegar a maior ou a média
    ads_1115.setGain(GAIN_TWOTHIRDS);        // 2/3 gain   +/- 6.144V  0.1875mV

    int16_t result = ads_1115.readADC_SingleEnded(ADS1115_MPPT);
    float voltageRead = result*(2*LIMIT_GAIN_TWO_THIRDS/(RESOLUTION_16BIT - 1.0))/1000.0; 
    //Serial.println("Tensão corrente MPPT: " + String(voltageRead));
  
    //Convert the voltage to the current in the ACS712
    float offset = 0.41;
    return ((voltageRead - ACS712_VCC/2.0)*1000.0/ACS712_OUTPUT_SENSITIVITY) - offset;
}
*/
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
