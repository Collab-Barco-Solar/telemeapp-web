import styles from '../../styles/components/Results.module.css';


export function Results() {
    return(
        <div className={styles.container}>
          <h1>Estimativas</h1>
          <div className={styles.results}>
            <p>Tempo Restante de Volta <br/> <span>00:01:30</span></p>
            <p>Tempo Restante de Corrida <br/> <span>00:01:30</span></p>
            <p>Velocidade Média <br/> <span>12 nós</span></p>
          </div>
        </div>
    )
  }