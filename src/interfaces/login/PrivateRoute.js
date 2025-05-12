import React from "react";
import { Outlet } from "react-router-dom";
import Logout from "./Logout";
const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
 if (!user || (user.exp<Date.now()/1000))  return Logout();
 return   <Outlet />;
};

export default PrivateRoute;