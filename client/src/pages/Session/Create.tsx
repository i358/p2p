import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { SessionManager } from "../../helpers/SessionManager";
import JoinButton from "../../components/Session/Create/JoinButton";
import EmailInputBox from "../../components/Session/Create/EmailInputBox";
import PasswordInputBox from "../../components/Session/Create/PasswordInputBox";
import UsernameInputBox from "../../components/Session/Create/UsernameInputBox";
import "../../assets/styles/Sign/Transforms.scss"
import api from "../../services/api";
import "../../assets/styles/Sign/Sign.scss";
import generateRandomUsername from "../../utils/generateRandomUsername";
import validator, { isStrongPassword } from "validator";
import moment from "moment";
import  API from "../../config/app.json";
import generateRandomColor from "../../utils/generateRandomColor";
let { ENDPOINTS } = API.API;
let POST_ENDPOINTS = ENDPOINTS.POST;
export default function Create() {
  const Session = new SessionManager.SessionManager();
  let { cookies, navigate, setCookies } = Session.setup();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [errorText, setErrorText] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const usernameRef = useRef<any>(null)
  const emailRef = useRef<any>(null)
  const iconRef = useRef<any>(null)
  const passwordRef = useRef<any>(null)
  const [IconRef, setIconRef] = useState(
    "fa-duotone fa-arrows-repeat p-[13.5px_15.5px]"
  );
  const [isGeneratorDisabled, setIsGeneratorDisabled] = useState(false);


  let oldEmail: any = true;
  let oldUsername: any = true;
  let oldPassword: any = true;

  Session.isSigned((t: any) => {
    if (t) return navigate("/app");
  });
  const handleUsernameChange = (e:any) => {
    setUsername(e.target.value)
  }
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };
  const handleKey = (e: any) => {
    if (e.keyCode === 13) {
      checkIsFormAvailable();
      e.preventDefault();
    }
  };


  const generateRandomUsername_ = () => {
    setIconRef("fa-solid fa-spinner-third animate-spin p-[13.5px_15.5px]");
    setIsGeneratorDisabled(true);
    generateRandomUsername().then((usr:any)=>{
      setTimeout(() => {
        setUsername(usr);
        setIconRef("fa-duotone fa-arrows-repeat p-[13.5px_15.5px]");
        setIsGeneratorDisabled(false);
      }, 500);
    })
  }

  useEffect(()=>{
   if(password.length>0){
    if(!isStrongPassword(password)){
      setErrorText((oldText: any) =>
        oldText.find((i: any) => i.id === 4)
          ? [...oldText]
          : [...oldText, { id: 4, text: "Your password must be at least 8 characters long and include at least one uppercase letter, lowercase letter, number, and special character (#, $, %, etc.)" }]
      );
      passwordRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
    }else{
      setErrorText(errorText.filter((i: any) => i.id !== 4));
      passwordRef.current.style = "border:none;color:white;";
     }
   }else{
    setErrorText(errorText.filter((i: any) => i.id !== 4));
    passwordRef.current.style = "border:none;color:white;";
   }
  }, [password])

  useEffect(() => {
    if (email.length > 0) {
      if (!validator.isEmail(email)) {
        setErrorText((oldText: any) =>
          oldText.find((i: any) => i.id === 1)
            ? [...oldText]
            : [...oldText, { id: 1, text: "Your email address is invalid." }]
        );
        emailRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";

      } else {
        setErrorText(errorText.filter((i: any) => i.id !== 1));
        emailRef.current.style = "border:none;color:white;";
        
      }
    } else {
      setErrorText(errorText.filter((i: any) => i.id !== 1));
      
      emailRef.current.style = "border:none;color:white;";
    }
  }, [email]);

  const checkIsFormAvailable = () => {
    setIsDisabled(true);
    if (
      !validator.isEmpty(email) &&
      validator.isEmail(email) && 
      validator.isStrongPassword(password) && 
      !validator.isEmpty(password) &&
      !validator.isEmpty(username) &&
      username.length >=2 &&
      username.length < 20
    ) {
      
      setErrorText([]);
      usernameRef.current.style = "border:none;color:white;";
      iconRef.current.className = "fa-regular fa-lock-open bg-[transparent!important]"
      emailRef.current.style = "border:none;color:white;";
      passwordRef.current.style = "border:none;color:white;";
      api({ url: POST_ENDPOINTS.ACCOUNT.NEW, data: { username, email, password, color:generateRandomColor() } }).then(
        ({ data }: any) => {
          if (data) {
            if (data.error) {
              
             setIsDisabled(false);
              setErrorText((oldText: any) =>
                oldText.find((i: any) => i.id === -3)
                  ? [...oldText]
                  : [...oldText, { id: -3, text: data.error }]
              );
              usernameRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
               iconRef.current.className = "fa-regular fa-lock bg-[transparent!important]"
              emailRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
              passwordRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
            }else{
           navigate("/session/sign")
            }
           
          }
        }
      );
    }
    if (
      validator.isEmpty(email) ||
      validator.isEmpty(password) ||
      !validator.isEmail(email) || 
      !isStrongPassword(password) ||
      username.length>=20 ||
      username.length<2
    ) {
      
      setIsDisabled(false);
      if(username.length>=20 || username.length<2){
        setErrorText((oldText: any) =>
          oldText.find((i: any) => i.id === 2)
            ? [...oldText]
            : [...oldText, { id: 2, text: "Your username must be between 2 and 20 characters long." }]
        );
        usernameRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
      }else{setErrorText(errorText.filter((i: any) => i.id !== 2));usernameRef.current.style = "border:none;color:white;";}
   
      if (validator.isEmpty(email)) {
        setErrorText((oldText: any) =>
          oldText.find((i: any) => i.id === 6)
            ? [...oldText]
            : [...oldText, { id: 6, text: "Email must not be empty." }]
        );
        emailRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
      } else {setErrorText(errorText.filter((i: any) => i.id !== 6));emailRef.current.style = "border:none;color:white;";}
      if(!isStrongPassword(password)){
        setErrorText((oldText: any) =>
          oldText.find((i: any) => i.id === 4)
            ? [...oldText]
            : [...oldText, { id: 4, text: "Your password must be at least 8 characters long and include at least one uppercase letter, lowercase letter, number, and special character (#, $, %, etc.)" }]
        );
        passwordRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
      }else{
        setErrorText(errorText.filter((i: any) => i.id !== 4));
        passwordRef.current.style = "border:none;color:white;";
       }
      
    }
  };

  useEffect(() => {
    if (
      !validator.isEmpty(username) &&
      username.length>=2 &&
      username.length<20 &&
      !validator.isEmpty(email) &&
      validator.isEmail(email) &&
      !validator.isEmpty(password) &&
      validator.isStrongPassword(password)
    ) {
      if(oldUsername !== username){
        setIsDisabled(false);
        oldEmail = username;
      }
      if (oldEmail !== email) {
        setIsDisabled(false);
        oldEmail = email;
      }
      if (oldPassword !== password) {
        setIsDisabled(false);
        oldPassword = password;
      }
    } else {
      if(oldUsername !== username) {
        setIsDisabled(true);
        oldUsername = username;
      }
      if (oldPassword !== password) {
        setIsDisabled(true);
        oldPassword = password;
      }
      if (oldEmail !== email) {
        setIsDisabled(true);
        oldEmail = email;
      }
    }
  }, [username, email, password]);

  return (
    <div className="grid place-items-center h-[100%] ">
      <div
        className="rounded-[15px] grid-rows-[auto,auto,auto,auto] grid gap-[5px] p-[5px]"
        style={{ background: "rgb(19 17 31 / 89%)",  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"}}
      >
        <div
          id="title"
          className="grid items-center p-[13px_18px] pt-[20px] font-[510] text-[20.5px] gap-[3px] grid-cols-[auto,1fr]"
        >
          <p className="grid grid-cols-[auto,auto] gap-[10px] place-items-center">
            <i className="fa-sharp fa-regular fa-starship-freighter text-[24.5px]" /> {""}
           Create Account
          </p>
        </div>
        <div className="border-t-[2.5px] border-[#282a418c] w-[100%]"></div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="pb-[7px] pt-[5px] grid items-center">
          <UsernameInputBox
              setup={{
                username,
                usernameRef,
                handleKey,
                handleUsernameChange,
                IconRef,
                isGeneratorDisabled,
                generateRandomUsername:generateRandomUsername_,
              }}
            />
            <EmailInputBox
              setup={{
                email,
                emailRef,
                handleKey,
                handleEmailChange,
              }}
            />
            <PasswordInputBox
              setup={{
                password,
                passwordRef,
                handleKey,
                handlePasswordChange,
              }}
            ></PasswordInputBox>
          </div>
          
          <div
            id="errorText"
            style={{
              display: errorText.length > 0 ? "block" : "none",
              animation:
                errorText.length > 0 ? "slideaway2 300ms" : "slideaway 100ms",
              wordWrap: "break-word",
            }}
            className="text-[#e64343] w-[90%] p-[5px_18px] text-[16px] grid items-center overflow-hidden"
          >
            {errorText.map((error: any, key: any) => {
              return <p key={key}><i className="fa-duotone fa-circle-exclamation mr-[2px]" /> {error.text} </p>;
            })}
          </div>
         <JoinButton data={{ checkIsFormAvailable, isDisabled, iconRef }} />
          <div className="border-t-[2.5px] border-[#282a418c] w-[100%] mt-[17px] mb-[5px]"></div>
         <div className="flex items-center justify-center p-[12px_15px] flex-row">
         <div className="text-[17px] text-[#cecdde] pt-[0px] overflow-hidden" style={{wordWrap: "break-word"}}>Already part of our family? <span className="text-[#f20f0f] underline hover:cursor-pointer font-[500]" onClick={()=>navigate("/session/sign")}>Log in</span> to access your account.</div>
        
         </div>
          </form>
      </div>
    </div>
  );
}
