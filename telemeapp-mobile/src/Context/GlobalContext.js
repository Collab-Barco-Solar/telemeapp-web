import { createContext, useState, useEffect } from "react";
import socket from "../services/socketio";

export const GlobalContext = createContext({});

export function InfoProvider({ children }) {
    const [data, setData] = useState({});
    const [voltage, setVoltage] = useState(0);

    useEffect(() => {
        socket.on("info", (data) => {
            // console.log("info", data);
            setVoltage(parseFloat(data.voltage_batteries));
        });
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                data,
                voltage,
                setData,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}