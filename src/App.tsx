import React, { useState, useEffect } from 'react';
import "./styles/App.scss";
import "./styles/tailwind.css";
import { socket } from './utils/socket'
const App = () => {
    const [isConnected, setConnected] = useState<boolean>(socket.connected)
    const [messages, setMessages] = useState<any>([])
    useEffect(() => {
        const established = (): void => {
            setConnected(socket.connected)
            socket.on("message", onMessage)
            socket.emit("message", { content: "Socket connected, send your first message!" })
        }
        const disconnected = (): void => {
            setConnected(socket.connected)
            socket.removeListener("message")
            setMessages((oldMessages: string[]) => [...oldMessages, { content: "Socket disconnected." }])

        }
        const onMessage = (message: any): void => {
            setMessages((oldMessages: string[]) => [...oldMessages, { content: message.content ?? "undefined" }])
        }
        socket.on("connect", established) 
        socket.on("disconnect", disconnected)
    }, [])

    return (
        <>
            <div className="grid grid-rows-[90%,10%] h-[100%]">
                <div>
                    {

                        messages.map((message: any, id: any) => {
                            return (
                                <p key={id}>
                                    {message.content}
                                </p>
                            )
                        })

                    }

                </div>
                <div>
                  <input type="text" className="w-[100%] p-4 r-[5px]" />
                </div>
            </div>
        </>
    )
}

export default App;