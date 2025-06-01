import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const userInfo = sessionStorage.getItem("userInfo");

  // If user is logged in, redirect to /upload
  if (userInfo) {
    return <Navigate to="/upload" replace />;
  }

  return children;
};

export default PublicRoute;
