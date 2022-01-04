import { createContext, useEffect, useState } from "react";
import socket from "../services/socketio";
import { saveAs } from "file-saver";

export const GlobalContext = createContext({});

let vectorData = [];

export function InfoProvider({ children }) {

  const [voltaAtual, setVoltaAtual] = useState(0);
  const [voltasTotais, setVoltasTotais] = useState(0);
  const [bandeiras, setBandeiras] = useState([]);
  const [tempo, setTempo] = useState(0);
  const [statusTempo, setStatusTempo] = useState(false);
  const [temposVoltas, setTemposVoltas] = useState([]);
  // const [vectorData, setVectorData] = useState([]);
  const [distanciaTotal, setDistanciaTotal] = useState(0);

  // Estimativas
  const [tempoRestanteVolta, setTempoRestanteVolta] = useState('');
  const [tempoRestanteCorrida, setTempoRestanteCorrida] = useState('');
  const [velocidadeMedia, setVelocidadeMedia] = useState(0);
  

  // Esse useEffect carrega as funcoes de socket e atualiza os dados quando chega uma nova mensagem
  useEffect(() => {
    socket.on('voltaAtual', (voltaAtual) => {
      setVoltaAtual(voltaAtual);
    })
    socket.on('voltasTotais', (voltasTotais) => {
      setVoltasTotais(voltasTotais);
    })
    socket.on('bandeiras', (bandeiras) => {
      setBandeiras(bandeiras);
    })

    socket.on('statusTempo', (statusTempo) => {
      setStatusTempo(statusTempo);
    })

    socket.on('temposVoltas', (temposVoltas) => {
      setTemposVoltas(temposVoltas);
    })

    socket.on('info', (data) => {
      // let newVectorData = vectorData;
      // newVectorData.push(data);
      // setVectorData(newVectorData);
      vectorData.push(data);
      // console.log(vectorData);
    }); 

    socket.on('allinfo', (data) => {
      // setVectorData(data);
      vectorData = data;
    });

    socket.on('tempo', (tempo) => {
      setTempo(tempo);
    });

    socket.on('distanciaTotal', (distanciaTotal) => {
      setDistanciaTotal(distanciaTotal);
    });

  }, [])

  function handleVoltaAtual(type) {
    let volta = 0;
    if (type === 'plus') {
      if (voltaAtual < voltasTotais) {
        volta = voltaAtual + 1;
        setVoltaAtual(volta);
        socket.emit('updateVoltaAtual', volta);
        socket.emit('adicionarTempoVolta', tempo);
      }
    } else {
      if (voltaAtual !== 0) {
        volta = voltaAtual - 1;
        setVoltaAtual(volta);
        socket.emit('updateVoltaAtual', volta);
        socket.emit('removerTempoVolta');
      }
    }
  }

  function handleVoltasTotais(qtd) {
    setVoltasTotais(qtd);
    socket.emit('updateVoltaAtual', 0);
    socket.emit('updateVoltasTotais', qtd);
    resetarTemposVoltas();
  }

  function handleBandeiras(bandeiras) {
    setBandeiras(bandeiras);
    socket.emit('updateBandeiras', bandeiras);
  }


  function calculaTempoRestanteVolta(tempo){
    //Encontra velocidade média em nós
    let velocidade = calculaVelocidadeMedia(tempo);    

    //Encontra a distância de cada volta em milhas nauticas
    let distanciaVolta = distanciaTotal / voltasTotais;

    //Calcula tempo que levaria para terminar a volta com a velocidade média
    let tempoEstimadoVolta = 0;
    if(velocidade > 0){
      tempoEstimadoVolta = distanciaVolta / velocidade;
    }
    
    //Pega tempo corrido da volta atual
    let tempoVoltasAcumulado = temposVoltas.length > 0 ? temposVoltas[temposVoltas.length-1] : 0;
    
    let tempoCorridoVolta = tempo - tempoVoltasAcumulado;

    //Retorna tempo restante para volta atual    
    return tempoEstimadoVolta - tempoCorridoVolta;
  }
  
  function calculaTempoRestanteCorrida(tempo){
    //Encontra velocidade média em nós
    let velocidade = calculaVelocidadeMedia(tempo);

    //Calcula tempo que levaria para terminar a corrida com a velocidade média
    let tempoEstimadoCorrida = 0;
    if(velocidade > 0){
      tempoEstimadoCorrida = distanciaTotal / velocidade;
    }

    //Retorna tempo restante para volta atual    
    return tempoEstimadoCorrida - tempo;
  }

  function calculaVelocidadeMedia(tempo){
    //Verifica se é a primeira volta
    let tempoX = tempo;
    if(temposVoltas.length == 0){
      //retorna velocidade media (GPS)
      return 0;
    }
    //else
    //Calcula a velocidade média baseada nas últimas voltas
    let velocidadeMedia = 0;

    let distanciaPercorrida = (distanciaTotal/voltasTotais)*voltaAtual;
    // console.log(temposVoltas);
    
    velocidadeMedia = distanciaPercorrida / temposVoltas[temposVoltas.length-1];
    // console.log(distanciaTotal);

    return velocidadeMedia;
  }


  
  function iniciarTempo() {
    socket.emit('iniciarTempo');
  }

  function pausarTempo() {
    socket.emit('pausarTempo');
  }

  function pararTempo() {
    socket.emit('pararTempo');
  }

  function resetarTemposVoltas() {
    socket.emit('resetarTemposVoltas');
  }

  function handleInputsConfig(voltasTotais, distanciaTotal){
    setVoltasTotais(voltasTotais);
    setDistanciaTotal(distanciaTotal);
    socket.emit('updateVoltasTotais', voltasTotais);
    socket.emit('updateDistanciaTotal', distanciaTotal);
  }

  function baixarDados() {
    const jsonObj = JSON.stringify(temposVoltas);
    const blob = new Blob([jsonObj], { type: "application/json" });
    saveAs(blob, "temposVoltas.json");

    jsonObj = JSON.stringify(vectorData);
    blob = new Blob([jsonObj], { type: "application/json" });
    saveAs(blob, "dadosSensores.json");
  };

  function formatNumber(number){
    let ehNegativo = false;
    if(number < 0){
      ehNegativo = true;
      number = -number;
    }
    let tempoFormatado = ("00" + Math.floor(number / 3600).toString()).slice(-2);
      tempoFormatado += ":" + ("00" + (Math.floor(number % 3600 / 60)).toString()).slice(-2);
      tempoFormatado += ":" + ("00" + ((number % 3600) % 60).toString()).slice(-2);
      
      if(ehNegativo){
        tempoFormatado = "-"+tempoFormatado;
      }
      return tempoFormatado;
  }

  return (
    <GlobalContext.Provider
      value={{
        voltaAtual,
        voltasTotais,
        bandeiras,
        tempo,
        statusTempo,
        temposVoltas,
        vectorData,
        distanciaTotal,
        handleVoltaAtual,
        handleVoltasTotais,
        handleBandeiras,
        iniciarTempo,
        pausarTempo,
        pararTempo,
        baixarDados,
        formatNumber,
        setDistanciaTotal,
        handleInputsConfig,
        calculaTempoRestanteVolta,
        calculaTempoRestanteCorrida,
        calculaVelocidadeMedia,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}