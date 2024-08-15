import { useRef, useState, useEffect } from "react";
import { SocketManager } from "../../helpers/SocketManager";
import { SessionManager } from "../../helpers/SessionManager";
import MessageBox from "../../components/Chat/MessageBox";
import validator, { isEmpty } from "validator";
import "../../assets/styles/Chat/Chat.scss";
import Nav from "../../components/Chat/Settings/Nav";
import Messages from "../../components/Chat/Messages";

import "rsuite/dist/rsuite.min.css";

export default function Chat() {
  let oldState: any = null;

  const Session = new SessionManager.SessionManager();
  let { cookies, navigate } = Session.setup();
  const MessageManager = new SocketManager.MessageManager();
  //@ts-ignore
  let {
    socket,
    messagesRef,
    messages,
    emitMessage,
    whoAreTyping,
    User,
    onlineUsersList,
    offlineUsersList,
    isThereTyping,
    meTyping,
    messagesLoaded,
  } = MessageManager.setup();

  const isDesktop = () => {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  const [message, setMessage] = useState<any>("");
  const messageRef = useRef<any>(null);
  const checkMessage = (key: any): void => {
    if (key.keyCode === 13 && !key.shiftKey && !isEmpty(message)) {
      key.preventDefault();
      sendMessage();
    }
  };

  const [isSigned, setIsSigned] = useState<boolean | null>(null);
  const [isMenuActivated, setIsMenuActivated] = useState(false);
  const [oldTypingStatus, changeOldTypingStatus] = useState<boolean | null>(
    null
  );
  const fileInputRef = useRef<any>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((oldFiles) => [...oldFiles, ...newFiles]);
    }
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

  const meTyping_ = (t: any) => {
    if (oldTypingStatus !== t) {
      meTyping(t);
      changeOldTypingStatus(t);
    }
  };
  const sendMessage = () => {
    if (!validator.isEmpty(message)) {
      messageRef.current.style.height = "1.7rem";
      messageRef.current.value = "";
      /* fileInputRef.current.value = "";*/
      setMessage("");
      emitMessage(
        {
          content: message.trim(),
        },
        { attachments: files.length > 0 && files }
      );
      setMessage("");
      //setFiles([])
      meTyping_(false);
    }
  };

  const [timeoutDuration, setTimeoutDuration] = useState(1500);
  useEffect(() => {
    if (socket) {
      if (socket.connected !== null || socket.connected !== undefined) {
        if (message) {
          meTyping_(true);
          const timeoutId = setTimeout(() => {
            meTyping_(false);
            setTimeoutDuration(1500);
          }, timeoutDuration);
          setTimeoutDuration((prevDuration) => prevDuration + 10);
          return () => clearTimeout(timeoutId);
        } else {
          setTimeout(() => {
            meTyping_(false);
            setTimeoutDuration(1500);
          }, 1500);
        }
      }
    }
  }, [message]);

  const updateTextBox = (e: any): void => {
    messageRef.current.style.height = "1.7rem";
    messageRef.current.style.height = `${e.target.scrollHeight}px`;
    setMessage(e.target.value);
  };
  const renderTypingStatus = () => {
    const count = whoAreTyping.length;

    if (count === 0) {
      return null;
    } else if (count === 1) {
      return (
        <span>
          <b>{whoAreTyping[0].split(".")[1]}</b> is typing...
        </span>
      );
    } else if (count === 2) {
      return (
        <span>
          <b>{whoAreTyping[0].split(".")[1]}</b> and{" "}
          <b>{whoAreTyping[1].split(".")[1]}</b> are typing...
        </span>
      );
    } else if (count === 3) {
      return (
        <span>
          <b>
            {whoAreTyping[0].split(".")[1]}, {whoAreTyping[1].split(".")[1]}
          </b>{" "}
          and <b>{whoAreTyping[2].split(".")[1]}</b> are typing...
        </span>
      );
    } else {
      return <span>Multiple people are typing...</span>;
    }
  };
  return (
    <div
      className="flex flex-1 h-[100%] bg-[#15151d] gap-[5px] flex-row w-[100%] color-[white]"
      style={{ fontFamily: "Exo 2" }}
    > 
    <div className="flex flex-1 flex-col">
    <div
        style={{
          position: "absolute",
          background: "black",
          opacity: ".2",
          display: isMenuActivated ? "block" : "none",
          transition: "all 0.4s",
          zIndex: 2,
          width: "100%",
          height: "100vh",
        }}
        onClick={() => setIsMenuActivated(false)}
      ></div>
      <div
        style={{
          position: "absolute",
          display: isMenuActivated ? "block" : "none",
          backdropFilter: "blur(3px)",
          width: "100%",
          height: "100vh",
          transition: "all 0.4s",
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          zIndex: 50,
          position: "absolute",
          height:"100%",
          width:"100%",
          transition: "all 0.4s",
          alignItems:"center",
          justifyContent:"center",
          display: isMenuActivated ? "flex" : "none",
        }}
      >
        <div
          style={{
            background: "#1F1E28",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);",
          }}
          className="rounded-[10px] flex flex-col"
        >
          <div className="p-[15px] rounded-[15px_15px_0_0] bg-[#416dff] align-start flex text-[21px] items-center ">
           <div className="flex-1  font-[600]"> <i className="fa-regular hover:animate-spin fa-gear mr-[5px]" /> Settings</div>
           <div className="hover:cursor-pointer" onClick={()=>setIsMenuActivated(false)}><i className="fa-sharp fa-solid fa-xmark"></i></div>
          </div>
          
          <div className="p-[5px] w-[35vw] text-[17px] font-[500]">
          <Nav 
          Icon="fa-regular fa-user-circle"
          Text="Edit Account"
          Color="white"
          Navigate="/me/edit"
          />
           <Nav 
          Icon="fa-sharp fa-solid fa-eye"
          Text="Privacy Settings"
          Color="white"
          Navigate="/me/secret"
          />
           
          <Nav
          Icon="fa-sharp fa-regular fa-hammer"
          Text="Area 51"
          Color="#69F"
          Navigate={`/!#/51/?u=${User.id}`} 
          />
          <Nav
          Icon="fa-solid fa-caret-right"
          Text="Log Out"
          Color="#ff5858"
          DisconnectSocket={true}
          Socket={socket}
          Navigate="/session/logout"
          />
         
          </div>
         
        </div>
      </div>
      <div
        id="navbar"
        className="p-[10px_10px] flex items-center justify-start w-[100%] text-[20px]"
      >
        <div
          onClick={() => setIsMenuActivated(true)}
          className="bg-[#2a2a3c] hover:cursor-pointer transition-[0.2s] hover:transition-[0.2s] p-[5px_10px] rounded-[10px] "
        >
          <i className="fa-regular hover:animate-spin fa-gear" />
        </div>
      </div>
      <div className="flex-1 pt-[20px] overflow-scroll">
        <div
          className="flex min-h-[100%] flex-col flex-1 items-end justify-end"
          ref={messagesRef}
        >
          <p style={{ color: "white", alignSelf: "center", fontSize: 30 }}>
            <b>Home.</b>
          </p>{" "}
          <p
            style={{
              alignSelf: "center",
              color: "#aaa",
              width: "38%",
              textAlign: "center",
              paddingBottom: 25,
            }}
          >
            {" "}
            Hi {User.username}! There's public chat. You can talking everyone and see them messages
          </p>
         <Messages
              messagesRef={messagesRef}
              Messages={messages}
              Data={messagesLoaded}
            ></Messages>
          <div className="h-[1.8rem]">&nbsp;</div>
        </div>
       
      </div>
      <div className="pt-[0] flex flex-col pb-[2px] pl-[18px] pr-[15px] bg-[transparent] ">
        <MessageBox
          Setup={{ messageRef, updateTextBox, checkMessage, isDesktop, User }}
        ></MessageBox>
        <div className="pl-[15px] pt-[4px] text-[15.5px]">
          <span
            className="transition-[.2s]"
            style={{
              overflow: "hidden",
              wordWrap: "break-word",
              animation: isThereTyping
                ? "slideawayTyping 200ms"
                : "slideawayTyping2 200ms",
              opacity: isThereTyping ? 1 : 0,
            }}
          >
            {isThereTyping && renderTypingStatus()}
          </span>{" "}
          <>&nbsp;</>{" "}
        </div>
      </div>{" "}
    </div>
    
    <div style={{
  background: "#1c1c26",
  width: "16vw",
  padding: "20px 15px",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Exo 2",
  gap: "10px" 
}}>
 {
 onlineUsersList.length>0 &&
    <div>
    <p className="text-[#777784] font-[530] text-[16px] ml-[8px]">ONLINE - {onlineUsersList.length}</p>
    <div className="flex flex-col">
      {onlineUsersList.map((user: any, key: any) => (
        <div key={key} className="hover:cursor-pointer flex rounded-[5px] hover:bg-[#50506d5e] flex-row items-center w-[100%] m-[0_5px] mb-[5px] pl-[5px] pb-[5px]">
          <div id="image" style={{ marginTop: 6, marginRight: 10, flexShrink: 0 }}>
            <img
              src="https://peer2p.online/default.png"
              className="w-[2.5rem] h-[2.5rem] rounded-[40px]"
              alt={user.id}
            />
          </div>
          <div id="content" className="flex-1 text-[17px] overflow-hidden">
            <div
              id="username"
              className="font-[600] max-w-[90%] overflow-hidden"
              style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", color: user.color }}
            >
              {user.username}
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  
}
  {
    offlineUsersList.length>0 &&
    <div>
  <p className="text-[#777784] font-[530] text-[16px] ml-[8px]">OFFLINE - {offlineUsersList.length}</p>
  <div className="flex flex-col" style={{opacity:".6"}}>
    {offlineUsersList.map((user: any, key: any) => (
      <div key={key} className="hover:cursor-pointer flex rounded-[5px] hover:bg-[#50506d5e] flex-row items-center w-[100%] m-[0_5px] mb-[5px] pl-[5px] pb-[5px]">
        <div id="image" style={{ marginTop: 6, marginRight: 10, flexShrink: 0 }}>
          <img
            src="https://media.printables.com/media/prints/612047/images/4859360_c751a68b-7241-405a-892a-d0af4f0260ec_282dc7ca-4282-4ec9-a6fa-db559817051b/thumbs/cover/800x800/png/bildschirmfoto-2023-10-06-um-122709.webp"
            className="w-[2.5rem] h-[2.5rem] rounded-[40px]"
            alt={user.id}
          />
        </div>
        <div id="content" className="flex-1 text-[17px] overflow-hidden">
          <div
            id="username"
            className="font-[500] max-w-[90%] overflow-hidden"
            style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", color: user.color }}
          >
            {user.username}
          </div>
        </div>
      </div>
    ))}
  </div>
  </div>
    }
</div>

  </div>
  );
}
