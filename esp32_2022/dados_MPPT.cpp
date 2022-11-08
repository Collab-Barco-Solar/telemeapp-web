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
  float tensao_bateria;
  float corrente_carregamento; // CORRENTE DE CARREGAMENTO
  float energia_painel; //ENERGIA DO PAINEL
  float rendimento_ontem; //RENDIMENTO ONTEM
  float potencia_ontem; //PODER ONTEM
  float rendimento_hoje; //RENDIMENTO HOJE
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

void read_mppt()
{
  if (Serial2.available())
  {
    String label, val;
    label = Serial2.readStringUntil('\t');                // this is the actual line that reads the label from the mppt controller
    val = Serial2.readStringUntil('\r\r\n');              // this is the line that reads the value of the label
    char buf[45];

    if (label == "I")                                           // I chose to select certain paramaters that were good for me. check the Victron whitepaper for all labels.
    {                                                           // In this case I chose to read charging current   
      val.toCharArray(buf, sizeof(buf));                        // conversion of val to a character array. Don't ask me why, I saw it in one of the examples of Adafruit and it works.
      dm.corrente_carregamento = atof(buf);                           // conversion to float
      dm.corrente_carregamento /= 1000;                       // calculating the correct value, see the Victron whitepaper for details. The value of label I is communicated in milli amps.
    }
    if (label == "V")
    {
      val.toCharArray(buf, sizeof(buf));                    // By studying these small routines, you can modify to reading the parameters you want,
      dm.tensao_bateria = atof(buf);                               // converting them to the desired value (milli-amps to amps or whatever)
      dm.tensao_bateria /= 1000;   
   }
    if (label == "VPV")
    {
      val.toCharArray(buf, sizeof(buf));                    // By studying these small routines, you can modify to reading the parameters you want,
      dm.energia_painel = atof(buf);
      dm.energia_painel /= 1000; // converting them to the desired value (milli-amps to amps or whatever)
    }
    if (label == "H22")
    {
      val.toCharArray(buf, sizeof(buf));
      dm.rendimento_ontem = atof(buf);
      dm.rendimento_ontem /= 1000;
    }
    if (label == "H20")
    {  
      val.toCharArray(buf, sizeof(buf));
      dm.potencia_ontem = atof(buf);
      dm.potencia_ontem /= 1000;    
    }
    if (label == "H23")
    {
      val.toCharArray(buf, sizeof(buf));
      dm.potencia_ontem = atof(buf);
      dm.potencia_ontem /= 1000;
    }
    /*
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
  read_mppt();
  String result = "";
  //result = String("tensao") + "," + String("energia") + "," + String("energia") + "," + String("rendimento");
  result = String(dm.tensao_bateria) + "," + String(dm.corrente_carregamento) + "," + String(dm.energia_painel) + "," + String(dm.rendimento_hoje);
            //+ String(dm.estado_carregamento) + "," + String(dm.mensagem_erro);
//dados.rendimento_ontem; //RENDIMENTO ONTEM
//dados.potencia_ontem; //PODER ONTEM

  return result;
}
