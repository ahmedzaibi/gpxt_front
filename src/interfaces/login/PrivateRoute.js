import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
