import { useContext, useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { Camera } from '../../components/Camera';
import { CompleteGraph, MiniGraph } from '../../components/Graph';
import { Header } from '../../components/Header';
import { Results } from '../../components/Results';
import { Times } from '../../components/Times';
import socket from '../../services/socketio';
import styles from '../../styles/pages/Home.module.css';
import { GlobalContext } from '../../context/GlobalContext';;

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})


// humidity: arrayDados[5],
// voltage_alimentation: arrayDados[6],
// lat: arrayDados[7],
// long: arrayDados[8],
// speed: arrayDados[9]

let vectorData = []

export default function Home(){
    const [info, setInfo] = useState({});

    useEffect(() => {
        socket.on('info', (data) => {
            vectorData.push(data);
            // console.log(vectorData);
            setInfo(data);
        }); 
        socket.on('allinfo', (data) => {
            vectorData = data;
            // console.log(data);
        });
    }, [])

    return(
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.topo}>
                    <Map admin={false} containerHeight={300} mapHeight="100%"/>
                    <Camera />
                </div>
                <div className={styles.meio}>
                    <MiniGraph type="current_motor" color="#fff" data={vectorData}/>
                    <MiniGraph type="current_alimentation" color="#CFF500" data={vectorData}/>
                    <MiniGraph type="voltage_alimentation" color="#59F5E9" data={vectorData}/>
                    <MiniGraph type="current_mppt" color="#00ff00" data={vectorData}/>
                    <MiniGraph type="voltage_batteries" color="#59F5E9" data={vectorData}/>                    
                    <MiniGraph type="speed" color="#E630E2" data={vectorData}/>
                    <MiniGraph type="humidity" color="#59F5E9" data={vectorData}/>
                    <MiniGraph type="temperature" color="#FF8405" data={vectorData}/>
                </div>
                <div className={styles.fim}>
                    <CompleteGraph data={vectorData}/>
                    <Times />
                    <Results />
                </div>
            </div>
        </>
    )
}