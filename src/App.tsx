import React, { useState, useEffect } from 'react';
import "./styles/App.scss";
import "./styles/tailwind.css";
import { socket } from './utils/socket'
const App = () => {
    const [isConnected, setConnected] = useState(socket.connected)
    const [ getTest, setTest ] = useState("Not any messages received.")
    useEffect(() => {
        const established = () => {  
            setConnected(socket.connected)
        }
        const disconnected = () => {
            setConnected(socket.connected)
        }
        const messageOn = (message:any) => {
            setTest(message.content || "unknown message")
        }
        socket.on("connect", established)
        socket.on("message", messageOn)
        socket.on("disconnect", disconnected)
    }, [])  

    return ( 
        <>
            <div className="grid text-[white] text-[45px] font-[600] place-items-center h-[100%]">
                Socket: {isConnected ? "Connected" : "Disconnected"}
                Last Message: {getTest}
            </div>
        </>
    )
}

export default App;