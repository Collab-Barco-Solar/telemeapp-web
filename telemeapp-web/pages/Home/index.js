import { useEffect, useState } from 'react';
import { Camera } from '../../components/Camera';
import { Header } from '../../components/Header';
import { Map } from '../../components/Map';
import socket from '../../services/socketio';
import styles from '../../styles/pages/Home.module.css';

export default function Home(){
    const [info, setInfo] = useState('');

    useEffect(() => {
        socket.on('info', (data) => {
        // console.log(data);
        setInfo(data);
        });
    }, [])

    return(
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.topo}>
                    <Map />
                    <Camera />
                </div>
                <div className={styles.meio}>

                </div>
                <div className={styles.fim}>

                </div>
            </div>
        </>
    )
}