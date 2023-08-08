import { useState, useEffect } from "react";
import { socket } from "../utils/socket";

export namespace SocketManager {
  export class MessageManager {
    setup() {
      const [isConnected, setConnected] = useState<boolean>(socket.connected);
      const [messages, setMessages] = useState<string[]>([]);
      interface Message {
        username: any;
        content: any;
        nickColor?: string;
      }
      useEffect(() => {
        const established = (): void => {
          setConnected(socket.connected);
          emitMessage({
            username: socket.id,
            content: `"${socket.id}" is here!`,
          });
          socket.on("message", onMessage);
        };
        const disconnected = (): void => {
          setConnected(socket.connected);
          addMessage({ username: socket.id, content: "Socket disconnected." });
        };
        const onMessage = (message: any): void => {
          addMessage(message);
        };
        socket.on("connect", established);
        socket.on("disconnect", disconnected);
      }, []);

      const emitMessage = (m: Message) => {
        socket.emit("message", m);
      };

      const addMessage = (m: Message) => {
        setMessages((oldMessages: any) => [...oldMessages, m]);
      };

      return { socket, messages, isConnected, emitMessage };
    }
  }
}
