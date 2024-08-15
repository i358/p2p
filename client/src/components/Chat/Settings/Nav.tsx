import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default (Props:any) => {
const { Color, Icon, Text, Navigate } = Props;
var navigate = useNavigate();
const handleClick = (n:any) => {
    if(Props.DisconnectSocket){
        Props.Socket.disconnect();
    }
   navigate(n)
}
return( 
    <div onClick={()=>handleClick(Navigate)} className={`hover:bg-[#40405069] rounded-[10px] hover:cursor-pointer p-[10px_0] flex flex-row gap-[3px] items-center`}>
        <div className="ml-[10px] flex-[.1] flex items-center justify-center"  style={{color:Color}}>
        <i className={`${Icon}`}></i>
        </div>
         
         <div className="text-[500] flex-[1.8]"  style={{color:Color}}>
            {Text}
         </div>
          </div>
)
}