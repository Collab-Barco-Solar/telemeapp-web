import { Header } from "../../components/Header";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map"), {
    ssr: false
})

export default function Admin(){
    return(
        <div>
            <Header />
            <h1>Admin</h1>
            <Map admin={true} containerHeight={600} mapHeight="95%"/>
        </div>
    )
}