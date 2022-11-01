#include "wifi.h"
#include "socketio.h"
#include "sensors.h"
//#include "dados_mppt.h"
#include <string.h>

#define RXD2 16
#define TXD2 17

typedef struct
{
  String ERR1 = "     Geen";
  String CS0 =  "      Uit";  //estado de operação - strings
  String CS2 =  "     Fout";
  String CS3 =  "     Bulk";
  String CS4 =  "Absorptie";
  String CS5 =  "  Druppel";
  char tensao_bateria[6];
  char corrente_carregamento[6]; // CORRENTE DE CARREGAMENTO
  char energia_painel[6]; //ENERGIA DO PAINEL
  char estado_carregamento[12]; //ESTADO DE CARREGAMENTO
  char mensagem_erro[12]; //MENSAGEM DE ERRO
  char rendimento_ontem[6]; //RENDIMENTO ONTEM
  char potencia_ontem[6]; //PODER ONTEM
  char rendimento_hoje[6]; //RENDIMENTO HOJE
} dadosmppt;

dadosmppt dms;

//void labelize(String val, char* var, int ratio, int floatpts);
void read_mppt();

void setup()
{
  Serial.begin(19200);
  Serial2.begin(19200, SERIAL_8N1, RXD2, TXD2);
  delay(250);
  init_wifi();
  init_socket();
  //init_mppt();
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
  read_mppt();

  if (currentmillis - previousmillis >= 1000)
  {
    //Serial.println("asokosaksa");
    //float current_mppt = get_mppt_current();
    //float current_alimentation = get_font_current();
    //float voltage_batteries = get_battery_voltage();
    Serial.print(">>>>>");
    Serial.println(dms.tensao_bateria);
    String result = String(dms.corrente_carregamento) + "," + String(dms.energia_painel) + "," + String(dms.rendimento_hoje) + "," + String(dms.tensao_bateria);
    //String result = "";
    //Serial.println("aaaaaaaa");
    //float current_motor = get_motor_current();
    float temperature = get_temperature();
    float humidity = get_humidity();
    float voltage_alimentation = get_font_voltage();
    //String gps = get_gps_info();

    String all_info = result + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation);
//  String all_info = String(current_mppt) + "," + String(current_alimentation) + "," + String(voltage_batteries) + "," + String(current_motor) + "," + String(temperature) + "," + String(humidity) + "," + String(voltage_alimentation) + "," + gps;
//    send_socket(all_info);
    Serial.println(all_info);

    //send_socket(String(all_info));
    previousmillis = currentmillis;
  }
}

/*
void labelize(String val, char* var, int ratio, int floatpts)
{
    byte len = 12;
    float valor_medido; //VALOR MEDIDO
    char buf[45];
    
    val.toCharArray(buf, sizeof(buf));
    valor_medido = atof(buf);
    valor_medido = valor_medido / ratio;
    dtostrf(valor_medido, len, floatpts, var);
    var[len] = ' '; 
    var[len + 1] = 0;
    //Serial.println(var);
}*/

void read_mppt()
{
  if (Serial2.available())
  {
    String label, val;
    byte len = 6;
    label = Serial2.readStringUntil('\t');                // this is the actual line that reads the label from the mppt controller
    val = Serial2.readStringUntil('\r\r\n');              // this is the line that reads the value of the label
    float valor_medido; //VALOR MEDIDO
    char buf[45];
    /*Serial.print("label: ");
    Serial.println(label);
    Serial.print("value: ");
    Serial.println(val);*/

    if (label == "I")                                           // I chose to select certain paramaters that were good for me. check the Victron whitepaper for all labels.
    {                                                           // In this case I chose to read charging current
      //labelize(val, dms.corrente_carregamento, 1000, 2);
      
      val.toCharArray(buf, sizeof(buf));                        // conversion of val to a character array. Don't ask me why, I saw it in one of the examples of Adafruit and it works.
      valor_medido = atof(buf);                           // conversion to float
      valor_medido = valor_medido / 1000;                       // calculating the correct value, see the Victron whitepaper for details. The value of label I is communicated in milli amps.
      dtostrf(valor_medido, len, 2, dms.corrente_carregamento);              // conversion of calculated value to string
      dms.corrente_carregamento[len] = ' '; 
      dms.corrente_carregamento[len + 1] = 0;
      //Serial.print("Corrente: ");
      //Serial.println(dms.corrente_carregamento);
    
    }
    if (label == "V")
    {
      //labelize(val, dms.tensao_bateria, 1000, 2);

      val.toCharArray(buf, sizeof(buf));                    // By studying these small routines, you can modify to reading the parameters you want,
      valor_medido = atof(buf);                               // converting them to the desired value (milli-amps to amps or whatever)
      valor_medido = valor_medido / 1000;
      dtostrf(valor_medido, len, 2, dms.tensao_bateria);          // setting color scheme etc.
      //dms.tensao_bateria[len] = ' '; 
      //dms.tensao_bateria[len + 1] = 0;    
      //Serial.print("Tensao bateria: ");
      //Serial.println(dms.tensao_bateria);
      
    }
    if (label == "VPV")
    {
      //labelize(val, dms.energia_painel, 1000, 2);
      
      val.toCharArray(buf, sizeof(buf));                    // By studying these small routines, you can modify to reading the parameters you want,
      valor_medido = atof(buf);
      valor_medido = valor_medido / 1000; // converting them to the desired value (milli-amps to amps or whatever)
      dtostrf(valor_medido, len, 2, dms.energia_painel);          // setting color scheme etc.
      dms.energia_painel[len] = ' '; 
      dms.energia_painel[len + 1] = 0;
      //Serial.print("Tensao Painel: ");
      //Serial.println(dms.energia_painel);
    
    }
    if (label == "H22")
    {
      //labelize(val, dms.rendimento_ontem, 100, 2);

      val.toCharArray(buf, sizeof(buf));
      float valor_medido = atof(buf);
      valor_medido = valor_medido / 100;
      dtostrf(valor_medido, len, 2, dms.rendimento_ontem);
      dms.rendimento_ontem[len] = ' '; 
      dms.rendimento_ontem[len + 1] = 0;
      // Serial.print("H22: ");
      //Serial.println(dms.rendimento_ontem);
      
    }
    if (label == "H20")
    {
      //labelize(val, dms.rendimento_hoje, 100, 2);
      
      val.toCharArray(buf, sizeof(buf));
      float valor_medido = atof(buf);
      valor_medido = valor_medido / 100;
      dtostrf(valor_medido, len, 2, dms.rendimento_hoje);
      dms.rendimento_hoje[len] = ' '; 
      dms.rendimento_hoje[len + 1] = 0;
      //Serial.print("H20: ");
      //Serial.println(dms.potencia_ontem);
    
    }
    if (label == "H23")
    {
      //labelize(val, dms.potencia_ontem, 1, 0);
      
      val.toCharArray(buf, sizeof(buf));
      valor_medido = atof(buf);
      dtostrf(valor_medido, len, 0, dms.potencia_ontem);
      dms.potencia_ontem[len] = ' '; 
      dms.potencia_ontem[len + 1] = 0;
      //Serial.print("H23: ");
      //Serial.println(dms.potencia_ontem);
    
    }
  }
}
