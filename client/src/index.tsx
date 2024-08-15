import * as React from "react";
import { createRoot } from "react-dom/client";
import router from "./routes/router";

 
import { RouterProvider } from "react-router-dom";

const container: any = document.getElementById("root");  

createRoot(container).render(<RouterProvider router={router} />);

