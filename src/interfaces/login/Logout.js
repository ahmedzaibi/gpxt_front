import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    const logout = async () => {
      if (hasLoggedOut.current) return;
      hasLoggedOut.current = true;

      try {
        await axios.get(
          `http://localhost:8181/https://tnhldapp0144.interpresales.mysoprahronline.com//hr-business-services-rest/business-services/logout`,
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        localStorage.clear();
        sessionStorage.clear();
        if (rememberedEmail) {
          localStorage.setItem("rememberedEmail", rememberedEmail);
        }
        navigate("/login", { replace: true });
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;
