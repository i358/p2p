import React, { useState, useEffect, useRef } from "react";
import "./styles/App.scss";
import "./styles/tailwind.css";
import { socket } from "./utils/socket";
const App = () => {
  const [isConnected, setConnected] = useState<boolean>(socket.connected);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<any>("");
  const inputRef = useRef<any>(null);
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
  const checkMessage = (key: any): void => {
    if (key.keyCode === 13 && message.length > 0) {
      setMessage(inputRef.current.value);
      inputRef.current.value = "";
      key.preventDefault();
    }
  };
  const updateTextBox = (e: any): void => {
    setMessage(e.target.value);
  };
  const emitMessage = (m: any) => {
    socket.emit("message", m);
  };
  const addMessage = (m: any): void => {
    setMessages((oldMessages: any) => [...oldMessages, m]);
  };
  return (
    <>
      <div className="grid grid-rows-[70vh,30vh] h-[100%]">
        <div className="p-[1rem_1rem]">
          {messages.map((message: any, id: any) => {
            return <p key={id}>{message.content}</p>;
          })}
        </div>
        <div className="grid items-end">
          <div className="bg-[#1c212d70] p-[.8rem_.6rem]">
            <textarea
              ref={inputRef}
              onChange={updateTextBox}
              onKeyDown={checkMessage}
              placeholder="Type somethings..."
              className="resize-none w-[100%] text-[18px] outline-[0] text-[#d2d2d2] placeholder-[#595d69] max-h-[28vh] p-[.70rem_1rem] rounded-[5px] h-[3.1rem] bg-[#1c212d]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
