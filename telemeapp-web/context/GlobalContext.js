import { createContext, useEffect, useState } from "react";
import socket from "../services/socketio";
import { saveAs } from "file-saver";

export const GlobalContext = createContext({});

export function InfoProvider({ children }) {

  const [voltaAtual, setVoltaAtual] = useState(0);
  const [voltasTotais, setVoltasTotais] = useState(0);
  const [bandeiras, setBandeiras] = useState([]);
  const [tempo, setTempo] = useState("00:00:00");
  const [statusTempo, setStatusTempo] = useState(false);
  const [temposVoltas, setTemposVoltas] = useState([]);
  const [vectorData, setVectorData] = useState([]);



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
      console.log(temposVoltas);
    })

    socket.on('info', (data) => {
      let newVectorData = vectorData;
      newVectorData.push(data);
      setVectorData(newVectorData);
    }); 

    socket.on('allinfo', (data) => {
      setVectorData(data);
    });

    socket.on('tempo', (tempo) => {
      let tempoFormatado = ("00" + Math.floor(tempo / 3600).toString()).slice(-2);
      tempoFormatado += ":" + ("00" + (Math.floor(tempo % 3600 / 60)).toString()).slice(-2);
      tempoFormatado += ":" + ("00" + ((tempo % 3600) % 60).toString()).slice(-2);

      setTempo(tempoFormatado);
    })
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

  function baixarDados() {
    const jsonObj = JSON.stringify(temposVoltas);
    const blob = new Blob([jsonObj], { type: "application/json" });
    saveAs(blob, "temposVoltas.json");

    jsonObj = JSON.stringify(vectorData);
    blob = new Blob([jsonObj], { type: "application/json" });
    saveAs(blob, "dadosSensores.json");
  };


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
        handleVoltaAtual,
        handleVoltasTotais,
        handleBandeiras,
        iniciarTempo,
        pausarTempo,
        pararTempo,
        baixarDados
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}