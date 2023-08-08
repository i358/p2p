import { useEffect, useState } from "react";
import { socket } from "../utils/socket";

const [isConnected, setConnected] = useState<boolean>(socket.connected);
const [messages, setMessages] = useState<string[]>([]);

useEffect(() => {
  const established = (): void => {
    setConnected(socket.connected);
    emitMessage({ content: `"${socket.id}" is here!` });
    socket.on("message", onMessage);
  };
  const disconnected = (): void => {
    setConnected(socket.connected);
    addMessage({ content: "Socket disconnected." });
  };
  const onMessage = (message: any): void => {
    addMessage(message);
  };
  socket.on("connect", established);
  socket.on("disconnect", disconnected);
}, []);

export const emitMessage = (m: any) => {
  socket.emit("message", m);
  addMessage(m)
};
export const addMessage = (m: any): void => {
  setMessages((oldMessages: any) => [...oldMessages, m]);
};

export { messages, setMessages, isConnected, setConnected, socket };