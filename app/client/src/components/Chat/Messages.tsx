import { useEffect, useState } from "react";
import "../../assets/styles/Chat/Messages.scss";
import Message from "./Message"; 

export default (Props: any) => {
  const [Messages, setMessages] = useState<any[]>([]);
  const messagesLoaded = Props.Data;
  const scrollContent = () => {
    Props.messagesRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
      inline: "nearest",
    });
  };
  const rand = () => {
    const minCeiled = Math.ceil(3.5);
    const maxFloored = Math.floor(9.5);
    return Math.floor(Math.random() * (maxFloored - minCeiled +1) + minCeiled)
  }
  let SkeletonMessages:any = [{
    isSkeleton:true,
    skeletonHeight:rand(),
  }]

  for(let i=0;i<20;i++){
    SkeletonMessages.push({
      isSkeleton:true,
      skeletonHeight:rand(),
    })
  }

  useEffect(() => {
    if (Props.Messages.length >= 0) {
      let lm = Props.Messages[Props.Messages.length - 2];
      let m2 = Props.Messages[Props.Messages.length - 1];

      if (m2 && !lm) {
        Props.Messages[Props.Messages.length - 1] = {
          ...m2,
          isAnotherUser: true,
        };
        setMessages(Props.Messages);
      }
      if (m2 && lm) {
        if (m2.sender.id === lm.sender.id) {
          Props.Messages[Props.Messages.length - 1] = {
            ...m2,
            isAnotherUser: false,
          };
          setMessages(Props.Messages);
        } else {
          Props.Messages[Props.Messages.length - 1] = {
            ...m2,
            isAnotherUser: true,
          };
          setMessages(Props.Messages);
        }
      }
    }
  }, [Props.Messages]);

  useEffect(() => {
    scrollContent();
  }, [Messages]);

  return (
    <>
      {messagesLoaded
        ? Messages.map((message: any, index: any) => {
            return(<Message Data={{message, index, scrollContent}} />)
          })
        : SkeletonMessages.map((message: any, index: any) => {
          return(<Message Data={{message, index, scrollContent}} />);
        })
        }
    </>
  );
};
