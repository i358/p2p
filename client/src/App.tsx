import React, { useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { Outlet } from "react-router-dom"; 

import "./assets/styles/App.scss";
import "./assets/styles/tailwind.css";

export default function App() {
useEffect(() => {
  
  console.log(
    `%c
    Dur yolcu! Bilmeden gelip bastığın,
    Bu toprak, bir devrin battığı yerdir.
    Eğil de kulak ver, bu sessiz yığın,
    Bir vatan kalbinin attığı yerdir.`,
    "color:white;font-weight:bold; font-size:20px;"
  );
}, []);
  const navTo = useNavigate();
  useEffect(() => navTo("/deprecated"), []);
  return (
    <>
     <div className="flex flex-row">
     <Outlet />
     </div>
    </>
  );
}