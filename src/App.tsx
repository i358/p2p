import React, { useState, useEffect } from 'react';
import "./styles/App.scss";
import "./styles/tailwind.css";
import { socket } from './utils/socket'
const App = () => {
    let [isConnected, setConnected] = useState(socket.connected)
    useEffect(() => {
        const established = () => {  
            setConnected(socket.connected)
        }
        const disconnected = () => {
            setConnected(socket.connected)
        }

        socket.on("connect", established)
        socket.on("disconnect", disconnected)
    }, [])  

    return ( 
        <>
            <div className="grid text-[white] text-[45px] font-[600] place-items-center h-[100%]">
                Socket: {isConnected ? "Connected" : "Disconnected"}
            </div>
        </>
    )
}

export default App;