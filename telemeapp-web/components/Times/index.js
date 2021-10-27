import styles from '../../styles/components/Times.module.css';

export function Times() {
    return(
        <div className={styles.container}>
          <h1>Tempos de volta</h1>

          <div className={styles.times}>
            <p>1 - 00:01:30</p>
            <p>2 - 00:01:30</p>
            <p>3 - 00:01:30</p>
            <p>4 - 00:01:30</p>
            <p>5 - 00:01:30</p>
            <p>6 - 00:01:30</p>
            <p>7 - 00:01:30</p>
            <p>8 - 00:01:30</p>
            <p>9 - 00:01:30</p>
            <p>10 - 00:01:30</p>
            <p>11 - 00:01:30</p>
            <p>12 - 00:01:30</p>
          </div>
        </div>
    )
  }