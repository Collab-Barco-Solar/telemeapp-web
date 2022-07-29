import dynamic from "next/dynamic";
import { Camera } from '../../components/Camera';
import { Header } from '../../components/Header';
import { Times } from '../../components/Times';
import styles from '../../styles/pages/Home.module.css';

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})

export default function Home(){
    return(
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.topo}>
                    <Camera />
                    <Times />
                    <iframe 
                        className={styles.youtube}
                        width="430" 
                        height="300" 
                        src="https://www.youtube.com/embed/5qap5aO4i9A" 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen />
                </div>
                <div className={styles.mapa}>
                    <Map admin={false} containerHeight={500} mapHeight="100%"/>
                </div>
            </div>
        </>
    )
}