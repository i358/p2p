import { createBrowserRouter, Outlet } from "react-router-dom";

import App from "../App";

import Chat from "../pages/Chat/Chat";
import Sign from "../pages/Session/Sign";
import Create from "../pages/Session/Create"
import Logout from "../pages/Session/Logout";

import NotFound from "../pages/NotFound";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  
  {
    path:"app",
    element:<Chat />,
  },
  {
    path: "session",
    element: <Outlet />,
    children: [
      {
        path:"sign",
        element:<Sign />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "new", 
        element: <Create />
      },
    ],
  },
]);
