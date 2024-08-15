import moment from "moment";
import api from "../../services/api";
import { useState, useEffect } from "react";
import { SessionManager } from "../../helpers/SessionManager";

export default function Message(Props: any) {
  const Session = new SessionManager.SessionManager();
  let { cookies } = Session.setup();
  const { index, message, scrollContent } = Props.Data;
  const [attachmentsLoaded, setAttachmentsLoaded] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  const fetchAttachment = async () => {
    message.attachments &&
      message.attachments.map(async (attachment: any, key: any) => {
        const res = await api({
          data: { attachment },
          url: "/attachments",
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${cookies["AUTH_TOKEN"]}`,
            "Content-Type": "application/json",
          },
        });
        const imgBlob = new Blob([res.data]);
        const imgURL = URL.createObjectURL(imgBlob);
        setAttachments((oldValues: any) => [...oldValues, imgURL]);
      });
      setAttachmentsLoaded(true)
      setTimeout(()=>{
        scrollContent();
      }, 1000)
  };

  useEffect(() => {
    fetchAttachment();
  }, [message.attachments]);

  return message.isSkeleton || !attachmentsLoaded ? (
    <div className="messageContainer gap-[10px!important]" key={index}>
      <p className="messageTitle bg-[#56515f6e] w-[25vw] h-[2.5vh] rounded-[15px] mt-[20px] animate-pulse">
        &nbsp;
      </p>
      <p
        className="bg-[#56515f6e] rounded-[15px] mb-[2px] animate-pulse"
        style={{ height: `${message.skeletonHeight}vh` }}
      >
        &nbsp;
      </p>
    </div>
  ) : !message.isSkeleton && attachmentsLoaded && (
    <div className="messageContainer" key={index}>
      
      {message.isAnotherUser && (
        <p
          className="messageTitle w-[25vw] rounded-[20px] mt-[9px] mb-[-3.5px] h-[max]"
          style={{ color: message.sender.color }}
        >
          {message.sender.username}
        </p>
      )}

      <p
        className="mb-[0.5px]"
        style={{
          color: message.isSent ? "white" : "#585870",
          wordWrap: "break-word",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          fontSize: "17px",
        }}
      >
        {message.content}{" "}
        <span style={{ color: "#aaa", fontSize: "13.5px" }}>
          ~ {moment(message.createdAt).format("DD.MM.YYYY (HH:mm)")}
        </span>
      </p>
      {attachments &&
        attachments.map((attachment: any, key: any) => (
          <img
            className="rounded-[10px]"
            src={attachments[0]}
            alt={"attachment_" + attachments[0]}
          />
        ))}
    </div>
  );
}
