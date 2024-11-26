import { useEffect } from "react";

export default function App(){

    const redirect = (url:any) => {
            window.open(url, '_blank');
    }
return (
    <>
    
<audio src={"https://peer2p.online/background.mp3"} autoPlay style={{display:"none"}}/>
    <div className="flex flex-1 flex-col justify-center items-center h-[100%] gap-[4em]" style={{backdropFilter:"blur(2px)"}}>
        
   <div id="text" className="flex items-center flex-col">
   <p className="text-[9em] font-[900] ">DEPRECATED</p>
   <p className="font-[500] text-[1.7em] text-[#d7d7d7]">This project is deprecated. There's nothing to see.</p>
   </div>
   <div className="font-[600] hover:cursor-pointer text-[3em] flex flex-row items-center justify-center gap-[1em] rounded-[15px] p-[15px_30px]" style={{background:"linear-gradient(#171921, #0b0a11)"}}>
    
   <i className="fa-brands fa-instagram" onClick={()=>redirect("https://instagram.com/allmylifeisoverthinking")} />
   <i className="fa-brands fa-discord"  onClick={()=>redirect("https://discord.com/")}/>
   <i className="fa-brands fa-spotify"  onClick={()=>redirect("https://spotify.com/")}/>
   <i className="fa-brands fa-github"  onClick={()=>redirect("https://github.com/i358")}/>
   
   </div>
    </div>
    </>
)


}