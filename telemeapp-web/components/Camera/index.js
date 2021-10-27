import styles from '../../styles/components/Camera.module.css';

export function Camera(){
    return(
        <div className={styles.container}>
            <img 
                // src="logo_sol.png"
                src="https://img.ibxk.com.br/2016/10/04/04184843355196.gif"
                alt="Logo Solares"
                width="90%"
                className={styles.logoSol}
            />
        </div>
    )
}