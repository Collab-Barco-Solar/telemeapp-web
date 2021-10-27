import styles from '../../styles/components/Camera.module.css';

export function Camera(){
    return(
        <div className={styles.container}>
            <img 
                src="logo_sol.png"
                alt="Logo Solares"
                height="100%"
                className={styles.logoSol}
            />
        </div>
    )
}