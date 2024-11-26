import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { SessionManager } from "../../helpers/SessionManager";
import JoinButton from "../../components/Session/Sign/JoinButton";
import EmailInputBox from "../../components/Session/Sign/EmailInputBox";
import PasswordInputBox from "../../components/Session/Sign/PasswordInputBox";
import "../../assets/styles/Sign/Transforms.scss"
import api from "../../services/api";
import "../../assets/styles/Sign/Sign.scss";
import validator from "validator";
import moment from "moment";
import  API from "../../config/app.json";
let { ENDPOINTS } = API.API;
let POST_ENDPOINTS = ENDPOINTS.POST;

export default function Sign() {
  const Session = new SessionManager.SessionManager();
  let { cookies, navigate, setCookies } = Session.setup();
  const [email, setEmail] = useState<string>("");
  const [errorText, setErrorText] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const emailRef = useRef<any>(null)
  const passwordRef = useRef<any>(null)

  let oldEmail: any = true;
  let oldPassword: any = true;
  Session.isSigned((t: any) => {
    if (t) return navigate("/app");
  });
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
    if (
      !validator.isEmpty(email) &&
      !validator.isEmpty(password) &&
      validator.isEmail(email)
    ) {
      setErrorText([]);
      emailRef.current.style = "border:none;color:white;";
      passwordRef.current.style = "border:none;color:white;";
      api({ url: POST_ENDPOINTS.ACCOUNT.SIGN, data: { email, password } }).then(
        ({ data }: any) => {
          if (data) {
            if (data.error) {
              setErrorText((oldText: any) =>
                oldText.find((i: any) => i.id === -3)
                  ? [...oldText]
                  : [...oldText, { id: -3, text: data.error }]
              );
              
              emailRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
              passwordRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
            }
            if (data.token) {
              setCookies("AUTH_TOKEN", data.token, {
                secure: true,
                path: "/",
              });
              navigate("/app");
            }
          }
        }
      );
    }
    if (
      validator.isEmpty(email) ||
      validator.isEmpty(password) ||
      !validator.isEmail(email)
    ) {
      if (validator.isEmpty(email)) {
        setErrorText((oldText: any) =>
          oldText.find((i: any) => i.id === 2)
            ? [...oldText]
            : [...oldText, { id: 2, text: "Email must not be empty." }]
        );
        emailRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
      } else {setErrorText(errorText.filter((i: any) => i.id !== 2));emailRef.current.style = "border:none;color:white;";}
      if (validator.isEmpty(password)) {
        setErrorText((oldText: any) =>
          oldText.find((i: any) => i.id === 3)
            ? [...oldText]
            : [...oldText, { id: 3, text: "Password must not be empty." }]
        );
        
        passwordRef.current.style = "border:2.5px #d12f2fc2 solid;color:#e05959;";
      } else {setErrorText(errorText.filter((i: any) => i.id !== 3));passwordRef.current.style = "border:none;color:white;";}
    }
  };

  useEffect(() => {
    if (
      !validator.isEmpty(email) &&
      validator.isEmail(email) &&
      !validator.isEmpty(password)
    ) {
      if (oldEmail !== email) {
        setIsDisabled(false);
        oldEmail = email;
      }
      if (oldPassword !== password) {
        setIsDisabled(false);
        oldPassword = password;
      }
    } else {
      if (oldPassword !== password) {
        setIsDisabled(true);
        oldPassword = password;
      }
      if (oldEmail !== email) {
        setIsDisabled(true);
        oldEmail = email;
      }
    }
  });

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
            <i className="fa-regular fa-right-to-bracket text-[24.5px]" /> {""}
            Sign In
          </p>
        </div>
        <div className="border-t-[2.5px] border-[#282a418c] w-[100%]"></div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="pb-[7px] pt-[5px] grid items-center">
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
         <JoinButton data={{ checkIsFormAvailable, isDisabled }} />
          <div className="border-t-[2.5px] border-[#282a418c] w-[100%] mt-[17px] mb-[5px]"></div>
         <div className="flex items-center justify-center p-[12px_15px] flex-row">
         <div className="text-[17px] text-[#cecdde] pt-[0px] overflow-hidden" style={{wordWrap: "break-word",}}>New here? Join our community by <span className="text-[#f20f0f] underline hover:cursor-pointer font-[500]" onClick={()=>navigate("/session/new")}>signing up</span> now!</div>
        
         </div>
          </form>
      </div>
    </div>
  );
}
