"use strict";

import React, { useRef, useState, useEffect } from "react";
import generateRandomColor from "../../utils/generateRandomColor";
import { SocketManager } from "../../helpers/SocketManager";
import { SessionManager } from "../../helpers/SessionManager";
import MessageBox from "../../components/Chat/MessageBox";
import validator, { isEmpty } from "validator";
import Messages from "../../components/Chat/Messages";
import "../../assets/styles/Chat/Chat.scss";

let oldState: any = null;

export default function Chat() {
  const Session = new SessionManager.SessionManager(); 
  let { cookies, navigate } = Session.setup();
  const MessageManager = new SocketManager.MessageManager();
  let {
    socket,
    scrollContent,
    scrollOnlyRef,
    scrollRef,
    messagesRef,
    messages,
    emitMessage,
    isThereTyping,
    typingText,
    meTyping,
  } = MessageManager.setup();
  const [isSigned, setIsSigned] = useState<boolean | null>(null);
  const [timeoutDuration, setTimeoutDuration] = useState(1500);
  const [showSendMessageButton, setShowSendMessageButton] =
    useState<boolean>(false);
  const [oldTypingStatus,changeOldTypingStatus] = useState<boolean|null>(null);

  const emptyRef = useRef<any>(null);
  const isDesktop = () => {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  useEffect(() => {
    if (isSigned) {
      document.title = "Peer to Peer: P2P ~ Chat";
    } else if (!isSigned && isSigned !== null) {
      if (socket) {
        if (socket.connected !== null || socket.connected !== undefined) {
          socket.disconnect();
        }
      }
      navigate("/session/sign");
    }
  }, [isSigned]);

  const focusTextarea = (e:any) => {
    messageRef.current.focus()
  }

  useEffect(() => {
    Session.isSigned((isSigned_: any) => {
      oldState = isSigned_;
      if (oldState === isSigned) {
      } else {
        setIsSigned(isSigned_);
       // console.log("Is signed?:", isSigned_);
      }
    });
  });
  const [message, setMessage] = useState<any>("");
  const messageRef = useRef<any>(null);
  const checkMessage = (key: any): void => {
    if (key.keyCode === 13 && isDesktop() && !key.shiftKey) {
      if (
       !isEmpty(message)
      )
        key.preventDefault();
      sendMessage();
    }
  };
  const meTyping_ = (t:any) => {
    if(oldTypingStatus!==t){
      meTyping(t);
      changeOldTypingStatus(t);
    }
  } 
   const sendMessage = () => {
    if (
      message &&
      message !== undefined &&
      message !== null &&
      message.trim() !== ""
    ) {
      messageRef.current.style.height = "1.7rem";
      messageRef.current.value = "";
      if (!isDesktop()) emptyRef.current.focus();
      messageRef.current.focus();
      setMessage("");
      emitMessage({
        content: message.trim() 
      });
      setShowSendMessageButton(false);
      meTyping_(false);
    }
  };

  useEffect(() => {
    if (socket) {
      if (socket.connected !== null || socket.connected !== undefined) {
    if (message) {
      if (!isDesktop()) setShowSendMessageButton(true);
      meTyping_(true);
      scrollOnlyRef();
      const timeoutId = setTimeout(() => {
      meTyping_(false);
      setTimeoutDuration(1500)
      }, timeoutDuration);
      setTimeoutDuration((prevDuration) => prevDuration + 10);
      return () => clearTimeout(timeoutId);
    } else {
      setShowSendMessageButton(false);
      setTimeout(() => {
        meTyping_(false);
        setTimeoutDuration(1500)
      }, 1500);
    }
  }
  }
  }, [message]);

  const updateTextBox = (e: any): void => {
    messageRef.current.style.height = "1.7rem";
    messageRef.current.style.height = `${e.target.scrollHeight}px`;
    setMessage(e.target.value);
    scrollContent();
  };
  return (
    <>
    <div className="grid grid-rows-[1fr,auto] gap-[15px] h-[100%]">
      <div className="header fixed">
hi
      </div>
      
      <div
        className="grid grid-rows-[1fr,auto] gap-[5px]"
        ref={scrollRef}
      >
        <div className="p-[0.9rem_1.1rem] pr-[.7rem] relative bottom-[0] pb-[.5rem] overflow-scroll grid items-end">
          <div className="items-end grid p-[.15rem_.25rem] pr-[.3rem]" ref={messagesRef}  onKeyDown={focusTextarea}>
            <Messages
              scrollRef={scrollRef}
              messagesRef={messagesRef}
              Messages={messages}
            ></Messages>
          </div>
        </div>
        <div className="relative bottom-[0] grid items-end">
          <div className="bg-[transparent] p-[1.1rem_0]  pt-[0rem] grid grid-rows-[1fr,auto] gap-[0px]">
            <p
              className={`${
                isDesktop() ? "p-[.4rem_1.2rem]" : "p-[.4rem_1rem]"
              } text-[14.5px] pr-[0] pt-[0] w-[100%]`}
              style={{
                overflow: "hidden",
                wordWrap: "break-word",
                display: isThereTyping ? "block" : "none",
                animation: isThereTyping
                  ? "slideawayTyping 200ms"
                  : "slideawayTyping2 200ms",
              }}
            >
              <b>{typingText.user}</b> {typingText.users>0 ? " and " : null} { typingText.users>0 ? (  <b>{typingText.users}</b>) : null } {typingText.content}
            </p>
            <div
              className={`${
                !isDesktop()
                  ? "grid items-center pr-[.45rem] grid-cols-[1fr,auto]"
                  : "pr-[.80rem]"
              } pt-[.6rem] pl-[.8rem]`}
              style={{ borderTop: "1px #1f1f2e9c solid" }}
            >
              <MessageBox
                Setup={{ messageRef, updateTextBox, checkMessage, isDesktop }}
              ></MessageBox>
              {isDesktop() ? null : (
                <button
                  ref={emptyRef}
                  type="button"
                  id="sendMessageButton"
                  style={{
                    display: showSendMessageButton ? "block" : "none",
                    animation: showSendMessageButton
                      ? "slideaway2 300ms"
                      : "slideaway 100ms",
                  }}
                  className="grid items-center bg-[#2d3bd9] rounded-[50px] h-[max-content] text-[23px] p-[15px] ml-[8px]"
                  onClick={sendMessage}
                >
                  <i
                    id="sendMessageButtonIcon"
                    className="fa-solid fa-paper-plane-top"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
