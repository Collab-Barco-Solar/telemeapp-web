import styles from '../../styles/components/Header.module.css';
import { GlobalContext } from '../../context/GlobalContext';
import { useContext } from 'react';

export function Header(){
    const {
        voltaAtual,
        voltasTotais
    } = useContext(GlobalContext);

    return(
        <div className={styles.container}>
            <img 
                src="logo.png"
                alt="Logo Solares"
                height="60%"
                className={styles.logo}
            />
            <img 
                src="logo_sol.png"
                alt="Logo Solares"
                height="60%"
                className={styles.logoSol}
            />

            <h2>Volta {voltaAtual}/{voltasTotais}</h2>

            <h2>00:10:45</h2>
        </div>
    )
}