import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false); // ✅ Track if logout has run

  useEffect(() => {
    const logout = async () => {
      if (hasLoggedOut.current) return; // ✅ Prevent multiple calls
      hasLoggedOut.current = true;

      try {
        await axios.get(
          `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/logout`,

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
