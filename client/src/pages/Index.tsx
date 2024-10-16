export default function App(){

    
return (
    <>
    
<audio src={"https://peer2p.online/background.mp3"} autoPlay style={{display:"none"}}/>
    <div className="flex flex-1 flex-col justify-center items-center h-[100%] gap-[4em]" style={{backdropFilter:"blur(2px)"}}>
        
   <div id="text" className="flex items-center flex-col">
   <p className="text-[9em] font-[900] ">OUTDATED</p>
   <p className="font-[500] text-[1.7em] text-[#d7d7d7]">This project is outdated. There's nothing to see.</p>
   </div>
   <div className="font-[600] hover:cursor-pointer text-[3em] flex flex-row items-center justify-center gap-[1em] rounded-[15px] p-[15px_30px]" style={{background:"linear-gradient(#171921, #0b0a11)"}}>
    
   <i className="fa-brands fa-instagram hover:text-[1.5em] transition-[all_0.2s] hover:transition-[all_0.2s]" />
   <i className="fa-brands fa-discord hover:text-[1.5em] transition-[all_0.2s] hover:transition-[all_0.2s]" />
   <i className="fa-brands fa-spotify hover:text-[1.5em] transition-[all_0.2s] hover:transition-[all_0.2s]" />
   <i className="fa-brands fa-github hover:text-[1.5em] transition-[all_0.2s] hover:transition-[all_0.2s]" />
   
   </div>
    </div>
    </>
)


}