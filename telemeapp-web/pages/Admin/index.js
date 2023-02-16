import { Header } from "../../components/Header";
import dynamic from "next/dynamic";
import { FiPlay, FiPause, FiSquare, FiPlus, FiMinus, FiDownload, FiSettings, FiLogOut, FiAlertTriangle } from "react-icons/fi";
import styles from '../../styles/pages/Admin.module.css';
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from 'sweetalert2'
import { useSession, signIn, signOut } from "next-auth/client"
import { Results } from '../../components/Results';
import { Times } from '../../components/Times';
import socket from "../../services/socketio";

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})

const CompleteGraph = dynamic(() =>  import("../../components/Graph"), { 
    ssr: false 
})

const MiniGraph = dynamic(() => import("../../components/MiniGraph"), { 
    ssr: false 
});

let vectorData = []
let vectorDataMini = []

export default function Admin(){
    const {
        handleVoltaAtual,
        iniciarTempo,
        pausarTempo,
        pararTempo,
        statusTempo,
        baixarDados,
        voltasTotais,
        distanciaTotal,
        handleInputsConfig,
    } = useContext(GlobalContext)

    const [session] = useSession();

    const [info, setInfo] = useState({});

    useEffect(() => {
        socket.on('info', (data) => {
            vectorData.push(data);
            //pega as ultimas 1000 posições do vectorData e salva no vectorDataMini
            if(vectorData.length > 1000){
                vectorDataMini = vectorData.slice(vectorData.length - 1000, vectorData.length)
            }
            else {
                vectorDataMini = vectorData
            }
            console.log(vectorDataMini);
            setInfo(data);
        }); 
        socket.on('allinfo', (data) => {
            vectorData = data;
        });
    }, [])



    function configuration(){
        Swal.fire({
            title: 'Configurações',
            html:
                '<div class="swal2-content-custom">' +
                    '<div class="swal2-input-container">' +
                        '<label>Voltas totais: </label>'+
                        `<input id="swal-input1" value=${voltasTotais}  class="swal2-input" autofocus>` +
                        '<label>Distância (mi):</label>'+
                        `<input id="swal-input2" value=${distanciaTotal} class="swal2-input" autofocus>` +
                    '</div>'+
                '</div>',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        }).then((result) => {
            if (result.value) {
                handleInputsConfig(result.value[0], result.value[1])
                Swal.fire(
                    'Configurações salvas!',
                    '',
                    'success'
                )
            }
        }
        )
    }

    function clearAll(){
        Swal.fire({
            title: 'Deseja realmente limpar todos os dados?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, limpar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                socket.emit('limparDados');
                Swal.fire(
                    'Dados limpos!',
                    '',
                    'success'
                )
            }
        })
    }
    // MUDAR DENTRO DO IF PARA if(session)
    if(true){
        console.log(session)
        return(
            <div className={styles.container}>
                <Header />
                <div className={styles.dangerArea}>
                    <button onClick={clearAll}>
                        <FiAlertTriangle size={30} color="#FFFFFF"/>    
                    </button>
                    <button onClick={signOut}>
                        <FiLogOut size={30} color="#FFFFFF"/>    
                    </button>
                </div>
                <div className={styles.control}>
                    <div className={styles.singleControl}>
                        <h1>Relógio</h1>
                        <div className={styles.singleControlIcons}>
                            { statusTempo?
                                <div>
                                    <FiPause size={50} color="#FFF" className={styles.icon} onClick={() => pausarTempo() }/>
                                    <FiSquare size={50} color="#FFF" className={styles.icon} onClick={() => pararTempo()}/>
                                </div>
                                :
                                <FiPlay size={50} color="#FFF" className={styles.icon} onClick={() => iniciarTempo()} />
                            }
                        </div>
                    </div>   
                    <div className={styles.singleControl}>
                        <h1>Volta</h1>
                        <div className={styles.singleControlIcons}>
                            <FiPlus size={50} color="#FFF" className={styles.icon} onClick={() => handleVoltaAtual('plus')} />
                            <FiMinus size={50} color="#FFF" className={styles.icon} onClick={() => handleVoltaAtual('')}/>    
                        </div>
                    </div>
                    <div className={styles.singleControl}>
                        <h1>Baixar Dados</h1>
                        <FiDownload size={50} color="#FFF" className={styles.icon} onClick={() => baixarDados()} />
                    </div> 
    
                    <div className={styles.singleControl}>
                        <h1>Config.</h1>
                        <FiSettings size={50} color="#FFF" className={styles.icon} onClick={() => configuration()} />
                    </div> 
                </div>
                
                <div className={styles.map}>
                    <Map admin={true} containerHeight={600} mapHeight="95%"/>
                </div>

                <div className={styles.meio}>
                    <MiniGraph type="motor_current" color="#fff" data={vectorDataMini}/>
                    <MiniGraph type="alimentation_voltage" color="#59F5E9" data={vectorDataMini}/>
                    <MiniGraph type="mppt_current" color="#00ff00" data={vectorDataMini}/>
                    <MiniGraph type="batteries_voltage" color="#59F5E9" data={vectorDataMini}/>                    
                    <MiniGraph type="humidity" color="#59F5E9" data={vectorDataMini}/>
                    <MiniGraph type="temperature" color="#FF8405" data={vectorDataMini}/> 
                </div>

                <div className={styles.fim}>
                    <CompleteGraph data={vectorData}/>
                    <Times />
                    <Results />
                </div>
            </div>
        )
    }
    else{
        return (
            <div className={styles.containerButton}>
                <div className={styles.buttonLogin} onClick={() => signIn('google')}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                        alt="Google Logo"
                        height="30px"
                    />
                    Entrar com o Google
                </div>
            </div>
        )
    }
}