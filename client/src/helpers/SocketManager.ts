import { useState, useRef, useEffect } from "react";
import { SessionManager } from "./SessionManager";
import API from "../config/app.json";
import api from "../services/api";
import sock from "../hooks/socket";
import moment from "moment";
import EventEmitter from "events";
let socket: any = null;
let emitMessage: any = null;
let meTyping: any = null;
let User: any = {};
let { ENDPOINTS } = API.API;
let POST_ENDPOINTS = ENDPOINTS.POST;
let lastSenderId: any;
const SocketEvents = new EventEmitter();
export namespace SocketManager {
  export class MessageManager {
    setup() {
      const Session = new SessionManager.SessionManager();
      const { cookies, setCookies, navigate } = Session.setup();
      const messagesRef = useRef<HTMLDivElement>(null);
      const [messages, setMessages] = useState<string[]>([]);
      const [onlineUsersList, setOnlineUsersList] = useState<string[]>([]);
      const [offlineUsersList, setOfflineUsersList] = useState<string[]>([]);
      const [isThereTyping, setIsThereTyping] = useState<boolean>(false);
      const [whoAreTyping, setWhoAreTyping] = useState<string[]>([]);
      const [messagesLoaded, setMessagesLoaded] = useState<any>(false);

      const scrollContent = () => {
        messagesRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
      };
      useEffect(() => {
        scrollContent();
      }, [messages]);
      const onMessage = (m: any) => {
        if (m.sender.id === User.id) {
          setMessages((oldMessages: any) =>
            oldMessages.map((message: any) =>
              message.token === m.token
                ? { ...message, isSent: true, attachments: m.attachments }
                : message
            )
          );
        } else {
          setMessages((oldMessages: any) => [...oldMessages, m]);
        }
        scrollContent();
      };

      useEffect(() => {
        if (whoAreTyping.length > 0) {
          setIsThereTyping(true);
        } else setIsThereTyping(false);
      }, [whoAreTyping]);

      const onTyping = (data: any) => {
        if (data.uid !== User.id) {
          if (data.typing) {
            let usr = `${data.uid}.${data.username}`;
            if (!whoAreTyping.some((user) => user === usr)) {
              setWhoAreTyping((old) => [...old, usr]);
            }
          } else {
            let usr = `${data.uid}.${data.username}`;
            setWhoAreTyping((old) => old.filter((user) => user !== usr));
          }
        }
      };
      const onMemberJoin = (data: any) => {
        api({
          url: POST_ENDPOINTS.USERS.RETRIEVE,
          headers: {
            Authorization: `Bearer ${cookies["AUTH_TOKEN"]}`,
          },
        })
          .then(({ data }: any) => {
            if (data) {
              console.log(data)
              setOnlineUsersList(data.online);
              setOfflineUsersList(data.offline);
              console.log(onlineUsersList)
              console.log(offlineUsersList)
            }
          })
          .catch((err) => {
            navigate("/error?reason=" + err);
          });
      };

      const onMemberLeft = (data: any) => {
        api({
          url: POST_ENDPOINTS.USERS.RETRIEVE,
          headers: {
            Authorization: `Bearer ${cookies["AUTH_TOKEN"]}`,
          },
        })
          .then(({ data }: any) => {
            if (data) {
              console.log(data)
              setOnlineUsersList(data.online);
              setOfflineUsersList(data.offline);
              console.log(onlineUsersList)
              console.log(offlineUsersList)
            }
          })
          .catch((err) => {
            navigate("/error?reason=" + err);
          });
      };

      useEffect((): any => {
        if (socket) {
          if (socket.connected) {
            socket.disconnect();
          }
        }

        Session.isSigned((isSigned: any) => {
          if (isSigned) {
            socket = sock.socket(cookies["AUTH_TOKEN"]);
            api({
              url: POST_ENDPOINTS.USER.RETRIEVE,
              headers: {
                Authorization: "Bearer " + cookies["AUTH_TOKEN"],
              },
            })
              .then(({ data }) => {
                if (data && data.username && data.id) {
                  User = data;
                } else navigate("/session/logout");
              })
              .catch((err) => {
                navigate("/error?reason=" + err);
              });
            api({
              url: POST_ENDPOINTS.MESSAGES.RETRIEVE,
              headers: {
                Authorization: "Bearer " + cookies["AUTH_TOKEN"],
              },
            })
              .then(({ data }) => {
                if (data) {
                  data.map((message: any) => {
                    if (lastSenderId === message.sender.id)
                      message.isAnotherUser = false;
                    else message.isAnotherUser = true;
                    lastSenderId = message.sender.id;
                    message.isSent = true;
                    setMessages((oldMessages: any) => [
                      ...oldMessages,
                      message,
                    ]);
                  });

                  setMessagesLoaded(true);
                }
              })
              .catch((err) => {
                navigate("/error?reason=" + err);
              });
            api({
              url: POST_ENDPOINTS.USERS.RETRIEVE,
              headers: {
                Authorization: `Bearer ${cookies["AUTH_TOKEN"]}`,
              },
            })
              .then(({ data }: any) => {
                if (data) {
                  console.log(data)
                  setOnlineUsersList(data.online);
                  setOfflineUsersList(data.offline);
                  console.log(onlineUsersList)
                  console.log(offlineUsersList)
                }
              })
              .catch((err) => {
                navigate("/error?reason=" + err);
              });
            emitMessage = (m: any, m2: any) => {
              let dateNow = moment().valueOf();
              m.token = Math.floor(Math.random() * 10000);
              const formData = new FormData();
              if (m2.attachments) {
                let files = m2.attachments;
                for (let i = 0; i < files.length; i++) {
                  formData.append("images", files[i]);
                }
              }
              formData.append("message", JSON.stringify(m));
              api({
                url: POST_ENDPOINTS.MESSAGES.SEND,
                data: formData,
                headers: {
                  Authorization: "Bearer " + cookies["AUTH_TOKEN"],
                  "Content-Type": "multipart/form-data",
                },
              }).catch((err) => {
                navigate("/error?reason=" + err);
              });
              let m_ = m;
              m_.sender = {
                username: User.username,
                id: User.id,
                color: User.color,
              };
              m_.createdAt = dateNow;
              lastSenderId === User.id
                ? (m_.isAnotherUser = false)
                : (m_.isAnotherUser = true);
              lastSenderId = User.id;
              setMessages((oldMessages: any) => [...oldMessages, m_]);
            };
            meTyping = (t: boolean) => {
              socket.emit("typing", {
                uid: User.id,
                username: User.username,
                typing: t,
              });
              //console.log("typing", t);
            };

            socket.on("connect", () => {
              socket.emit("join", cookies);
              socket.on("typing", onTyping);
              socket.on("message", onMessage);
              socket.on("MEMBER_JOIN", onMemberJoin);
              socket.on("MEMBER_LEFT", onMemberLeft);
            });
            socket.on("connect_error", (reason: any) => {
              navigate("/error?reason=" + reason);
            });
          }
        });
      }, []);

      return {
        scrollContent,
        messagesRef,
        messages,
        emitMessage,
        socket,
        whoAreTyping,
        isThereTyping,
        meTyping,
        messagesLoaded,
        User,
        onlineUsersList,
        offlineUsersList,
      };
    }
  }
}
