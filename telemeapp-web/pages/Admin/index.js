import { Header } from "../../components/Header";
import dynamic from "next/dynamic";
import { FiPlay, FiPause, FiSquare, FiPlus, FiMinus, FiDownload, FiSettings } from "react-icons/fi";
import styles from '../../styles/pages/Admin.module.css';
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Swal from 'sweetalert2'
import { useSession, signIn, signOut } from "next-auth/client"

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})

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

    if(session){
        console.log(session)
        return(
            <div className={styles.container}>
                <Header />
                <button onClick={signOut}>Logout</button>
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
                
                <Map admin={true} containerHeight={600} mapHeight="95%"/>
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