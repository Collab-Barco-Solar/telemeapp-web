import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { Camera } from '../../components/Camera';
import { CompleteGraph, MiniGraph } from '../../components/Graph';
import { Header } from '../../components/Header';
import { Results } from '../../components/Results';
import { Times } from '../../components/Times';
import socket from '../../services/socketio';
import styles from '../../styles/pages/Home.module.css';

export default function Home(){
    const [info, setInfo] = useState('');

    const MapWithNoSSR = dynamic(() => import("../../components/Map"), {
        ssr: false
    })
    

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
                    <MapWithNoSSR />
                    <Camera />
                </div>
                <div className={styles.meio}>
                    <MiniGraph type="cBarramento" color="#fff" />
                    <MiniGraph type="tModulos" color="#CFF500"/>
                    <MiniGraph type="cBaterias" color="#00ff00"/>
                    <MiniGraph type="tBaterias" color="#59F5E9"/>
                    <MiniGraph type="velocidade" color="#E630E2"/>
                    <MiniGraph type="temperatura" color="#FF8405"/>
                </div>
                <div className={styles.fim}>
                    <CompleteGraph />
                    <Times />
                    <Results />
                </div>
            </div>
        </>
    )
}