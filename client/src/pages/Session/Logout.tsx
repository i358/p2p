import { useEffect } from "react";
import { SessionManager } from "../../helpers/SessionManager";

export default function Logout(){
const Session = new SessionManager.SessionManager();
let {removeCookie, navigate} = Session.setup()
Session.isSigned((t:any)=>{
    if(t){
       removeCookie("AUTH_TOKEN", {path:"/"});
       useEffect(()=>navigate("/session/sign"), [])
    }
    else {
        useEffect(()=>navigate("/session/sign"), [])
    }
})
return(<>Sign out...</>)
}