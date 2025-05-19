import React from "react";
import { Outlet } from "react-router-dom";
import Logout from "./Logout";
const PrivateRoute = () => {
  const data = JSON.parse(localStorage.getItem("data"));
 if (!data )  return Logout();
 return   <Outlet />;
};

export default PrivateRoute;