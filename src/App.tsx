import { useRef, useState } from "react";
import "./styles/App.scss";
import "./styles/tailwind.css";
import { messages, emitMessage, socket } from "./helpers/util";
const App = () => {
  const [message, setMessage] = useState<any>(""); 
  const messageRef = useRef<any>(null);

  const checkMessage = (key: any): void => {
    if (key.keyCode === 13 && message.length > 0) {
      emitMessage({ username: socket.id, content: message });
      messageRef.current.value = "";
      setMessage("");
      key.preventDefault();
    }
  };
  const updateTextBox = (e: any): void => {
    setMessage(e.target.value);
  };
  return (
    <>
      <div className="grid grid-rows-[70vh,30vh] h-[100%]">
        <div className="p-[1rem_1rem]">
          {messages.map((message: any, id: any) => {
            return (
              <p key={id}>
                {message.username ? (
                  <span className="font-[600]">{message.username}: </span>
                ) : (
                  ""
                )}
                {message.content}
              </p>
            );
          })}
        </div>
        <div className="grid items-end">
          <div className="bg-[#141822] p-[.8rem_.6rem]">
            <textarea
              ref={messageRef}
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
