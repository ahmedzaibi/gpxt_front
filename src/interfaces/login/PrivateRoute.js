import React from "react";
import { Outlet } from "react-router-dom";
import Logout from "./Logout";
const PrivateRoute = () => {
  const data = JSON.parse(sessionStorage.getItem("userInfo"));
  if (!data) return Logout();
  return <Outlet />;
};

export default PrivateRoute;
