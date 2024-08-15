
//https://i.imgur.com/zL4l6XB.png
export default function Message(Props:any){
  const { index, message, scrollContent } = Props.Data;
  //#56515f6e
  return( message.isSkeleton ? (
    <div key={index} className="grid items-center justify-center grid-cols-[auto,1fr] p-[5px_25px] pr-[20px] w-[100%] gap-[12px]" style={{paddingTop:"18px" }}> 
        <div id="image" style={{alignSelf:"start"}}>
            <div className="w-[2.5rem] h-[2.5rem] rounded-[40px] bg-[#56515f6e] animate-pulse" />
        </div>
        <div id="content" className="grid grid-cols-[auto] text-[18.5px] gap-[10px]">
        
            <div id="username" className="bg-[#56515f6e] w-[25%] rounded-[13px] animate-pulse">&nbsp;</div>
       
            <p className="bg-[#56515f6e] rounded-[10px] animate-pulse" style={{height:`${message.skeletonHeight}vh`}}></p> 
        </div>
    </div>
  ) : (  
    <div key={index} className="grid hover:bg-[rgba(35,35,43,0.41)] grid-cols-[auto,1fr] p-[0_25px] pr-[20px] w-[100%] gap-[15px]" style={{marginTop:message.isAnotherUser && "20px" }}> 
        <div id="image" style={{alignSelf:"start"}}>
        {message.isAnotherUser ? (
            <img style={{marginTop:6}} src="https://peer2p.online/default.png" className="w-[2.5rem] h-[2.5rem] rounded-[40px] hover:cursor-pointer"  alt={message.sender.id} />
        ) : (<div className="w-[2.5rem]"></div>)} 
        </div>
        <div id="content" className="grid grid-rows-[auto] text-[19px]">
        {message.isAnotherUser && (
            <div id="username" className="font-[600] w-[max-content] hover:underline hover:cursor-pointer max-w-[25%] overflow-hidden" style={{textOverflow:"ellipsis", whiteSpace:"nowrap",color:message.sender.color}}>{message.sender.username}</div>
        )}
            <p id="message" className="hover:cursor-text" style={{ fontSize:"18px", color: message.isSent ? "white" : "#585870",
          wordWrap: "break-word",
          overflow: "hidden",
          whiteSpace: "pre-wrap"}}>{message.content}</p>
        
        </div>
    </div>
    )
  )
}
/**/