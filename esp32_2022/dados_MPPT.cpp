/* Connections:
    mppt pin     mppt        ESP         ESP pin
    1            GND         GND         GND
    2            RX          TX          -              usar APENAS se for desejável enviar informaçoes (programar) o mppt. Para mais informações, ler documento XXXXX.
    3            TX          RX          16
    4            Power+      none        -              não usar!
*/

#include "dados_mppt.h"

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

dadosmppt dm;

unsigned long previousmpptUpdate = 0;
int UPDATE_PERIOD_MS = 1000;

#define RXD2 16
#define TXD2 17

void init_mppt(void)
{

  Serial2.begin(19200, SERIAL_8N1, RXD2, TXD2);
  
}

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
}

void read_mppt(dadosmppt &dm)
{
  if (Serial2.available())
  {
    String label, val;
    byte len = 12;
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
      //labelize(val, dm.corrente_carregamento, 1000, 2);
      
      val.toCharArray(buf, sizeof(buf));                        // conversion of val to a character array. Don't ask me why, I saw it in one of the examples of Adafruit and it works.
      valor_medido = atof(buf);                           // conversion to float
      valor_medido = valor_medido / 1000;                       // calculating the correct value, see the Victron whitepaper for details. The value of label I is communicated in milli amps.
      dtostrf(valor_medido, len, 2, dm.corrente_carregamento);              // conversion of calculated value to string
      dm.corrente_carregamento[len] = ' '; 
      dm.corrente_carregamento[len + 1] = 0;
      Serial.print("Corrente: ");
      Serial.println(dm.corrente_carregamento);
    
    }
    if (label == "V")
    {
      //labelize(val, dm.tensao_bateria, 1000, 2);
      val.toCharArray(buf, sizeof(buf));                    // By studying these small routines, you can modify to reading the parameters you want,
      valor_medido = atof(buf);                               // converting them to the desired value (milli-amps to amps or whatever)
      valor_medido = valor_medido / 1000;
      dtostrf(valor_medido, len, 2, dm.tensao_bateria);          // setting color scheme etc.
      dm.tensao_bateria[len] = ' '; 
      dm.tensao_bateria[len + 1] = 0;
      Serial.print("Tensao bateria: ");
      Serial.println(dm.tensao_bateria);
      
    }
    if (label == "VPV")
    {
      //labelize(val, dm.energia_painel, 1000, 2);
      
      val.toCharArray(buf, sizeof(buf));                    // By studying these small routines, you can modify to reading the parameters you want,
      valor_medido = atof(buf);
      valor_medido = valor_medido / 1000; // converting them to the desired value (milli-amps to amps or whatever)
      dtostrf(valor_medido, len, 2, dm.energia_painel);          // setting color scheme etc.
      dm.energia_painel[len] = ' '; 
      dm.energia_painel[len + 1] = 0;
      Serial.print("Tensao Painel: ");
      Serial.println(dm.energia_painel);
    
    }
    if (label == "H22")
    {
      //labelize(val, dm.rendimento_ontem, 100, 2);

      val.toCharArray(buf, sizeof(buf));
      float valor_medido = atof(buf);
      valor_medido = valor_medido / 100;
      dtostrf(valor_medido, len, 2, dm.rendimento_ontem);
      dm.rendimento_ontem[len] = ' '; 
      dm.rendimento_ontem[len + 1] = 0;
      // Serial.print("H22: ");
      //Serial.println(dm.rendimento_ontem);
      
    }
    if (label == "H20")
    {
      //labelize(val, dm.rendimento_hoje, 100, 2);
      
      val.toCharArray(buf, sizeof(buf));
      float valor_medido = atof(buf);
      valor_medido = valor_medido / 100;
      dtostrf(valor_medido, len, 2, dm.rendimento_hoje);
      dm.rendimento_hoje[len] = ' '; 
      dm.rendimento_hoje[len + 1] = 0;
      //Serial.print("H20: ");
      //Serial.println(dm.potencia_ontem);
    
    }
    if (label == "H23")
    {
      //labelize(val, dm.potencia_ontem, 1, 0);
      
      val.toCharArray(buf, sizeof(buf));
      valor_medido = atof(buf);
      dtostrf(valor_medido, len, 0, dm.potencia_ontem);
      dm.potencia_ontem[len] = ' '; 
      dm.potencia_ontem[len + 1] = 0;
      //Serial.print("H23: ");
      //Serial.println(dm.potencia_ontem);
    
    }/*
    else if (label == "ERR")                               // This routine reads the error code. If there is no error, "Geen" will be printed. See line 24 of this sketch
    {                                                      // else the actual error code will be printed. Refer to the Victron whitepaper for reference.
      val.toCharArray(buf, sizeof(buf));
      int intvalor_medido = atoi(buf);
      if (intvalor_medido == 0)
      {
        dm.ERR1.toCharArray(dm.mensagem_erro, len);
      }
      else if (intvalor_medido != 0)
      {
        //itoa (dm.mensagem_erro, intvalor_medido, 12);
      }

    }
    else if (label == "CS")                                  // this routine reads Charge Status, see lines 25 - 29
    {
      val.toCharArray(buf, sizeof(buf));
      int intvalor_medido = atoi(buf);
      if (intvalor_medido == 0)
      {
        dm.CS0.toCharArray(dm.estado_carregamento, len);
      }
      else if (intvalor_medido == 2)
      {
        dm.CS2.toCharArray(dm.estado_carregamento, len);
      }
      else if (intvalor_medido == 3)
      {
        dm.CS3.toCharArray(dm.estado_carregamento, len);
      }
      else if (intvalor_medido == 4)
      {
        dm.CS4.toCharArray(dm.estado_carregamento, len);
      }
      else if (intvalor_medido == 5)
      {
        dm.CS5.toCharArray(dm.estado_carregamento, len);
      }
      dm.estado_carregamento[len] = ' '; 
      dm.estado_carregamento[len + 1] = 0;

      //Serial.print("CS: ");
      //Serial.println(estado_carregamento);
    }*/
  }
}

String get_dados_mppt()
{
  read_mppt(dm);
  String result = "";
  //result = String("tensao") + "," + String("energia") + "," + String("energia") + "," + String("rendimento");
  result = String(dm.tensao_bateria) + "," + String(dm.corrente_carregamento) + "," + String(dm.energia_painel) + "," + String(dm.rendimento_hoje);
            //+ String(dm.estado_carregamento) + "," + String(dm.mensagem_erro);
//dados.rendimento_ontem; //RENDIMENTO ONTEM
//dados.potencia_ontem; //PODER ONTEM

  /*unsigned long currentTime = millis();
  if ((unsigned long)(currentTime - previousmpptUpdate) >= UPDATE_PERIOD_MS)
  {
    read_mppt(dm);
    
    // RESET timer
    previousmpptUpdate = millis();
  }*/
  Serial.println(">>>>>");
  //Serial.println(dm.tensao_bateria);
  return result;
}
