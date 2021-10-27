import styles from '../../styles/components/Header.module.css';

export function Header(){
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

            <h2>Volta 2/5</h2>

            <h2>00:10:45</h2>
        </div>
    )
}