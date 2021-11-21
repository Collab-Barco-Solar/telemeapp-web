import { createContext, useEffect, useState } from "react";
import socket from "../services/socketio";

export const GlobalContext = createContext({});

export function InfoProvider({ children }) {

  const [voltaAtual, setVoltaAtual] = useState(0);
  const [voltasTotais, setVoltasTotais] = useState(0);
  const [bandeiras, setBandeiras] = useState([]);
  const [tempo, setTempo] = useState("00:00:00");
  const [statusTempo, setStatusTempo] = useState(false);




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

      socket.on('tempo', (tempo) => {
          let tempoFormatado = ("00" + Math.floor(tempo/3600).toString()).slice(-2);
          tempoFormatado += ":" + ("00" + (Math.floor(tempo%3600/60)).toString()).slice(-2); 
          tempoFormatado += ":" + ("00" + ((tempo%3600)%60).toString()).slice(-2); 
        
          setTempo(tempoFormatado);
      })
  },[])

  function handleVoltaAtual(type){
    let volta = 0;
    if(type === 'plus'){
        if(voltaAtual < voltasTotais){
            volta = voltaAtual + 1;
            setVoltaAtual(volta);
        }
    }else{
        if(voltaAtual !== 0){
            volta = voltaAtual - 1;
            setVoltaAtual(volta);
        }
    }
    socket.emit('updateVoltaAtual', volta);
  }

  function handleVoltasTotais(qtd){
    setVoltasTotais(qtd);
    socket.emit('updateVoltasTotais', qtd);
  }

  function handleBandeiras(bandeiras){
    setBandeiras(bandeiras);
    socket.emit('updateBandeiras', bandeiras);
  }

  function iniciarTempo(){
    socket.emit('iniciarTempo');
  }

  function pausarTempo(){
    socket.emit('pausarTempo');
  }

  function pararTempo(){
    socket.emit('pararTempo');
  }

  return (
    <GlobalContext.Provider
      value={{
        voltaAtual,
        voltasTotais,
        bandeiras,
        tempo,
        statusTempo,
        handleVoltaAtual,
        handleVoltasTotais,
        handleBandeiras,
        iniciarTempo,
        pausarTempo,
        pararTempo
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}