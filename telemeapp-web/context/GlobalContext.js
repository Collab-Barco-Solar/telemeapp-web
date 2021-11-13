import { createContext, useEffect, useState } from "react";
import socket from "../services/socketio";

export const GlobalContext = createContext({});

export function InfoProvider({ children }) {

  const [voltaAtual, setVoltaAtual] = useState(0);
  const [voltasTotais, setVoltasTotais] = useState(0);
  const [bandeiras, setBandeiras] = useState([]);

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

  return (
    <GlobalContext.Provider
      value={{
        voltaAtual,
        voltasTotais,
        bandeiras,
        handleVoltaAtual,
        handleVoltasTotais,
        handleBandeiras
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}