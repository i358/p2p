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
            socket.emit("message", {content:"Socket connected, send your first message!"})
        }
        const disconnected = (): void => {
            setConnected(socket.connected)
            setMessages((oldMessages: string[]) => [...oldMessages, { content: "Socket disconnected." }])
        }
        const onMessage = (message: any): void => {
            setMessages((oldMessages: string[]) => [...oldMessages, { content: message.content ?? "undefined" }])
        }
        socket.on("connect", established)
        socket.on("message", onMessage)
        socket.on("disconnect", disconnected)
    }, [])

    return (
        <>
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
        </>
    )
}

export default App;