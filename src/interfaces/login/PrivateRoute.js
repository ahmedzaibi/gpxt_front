import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userInfo = sessionStorage.getItem("current-user-ss");
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
