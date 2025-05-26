import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const domainUrl =
        sessionStorage.getItem("DOMAIN_URL") || window.location.origin;

      try {
        sessionStorage.clear();
        await fetch(
          `${domainUrl}/hr-business-services-rest/business-services/logout`,
          {
            method: "GET",
          }
        );
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        localStorage.clear();
        if (rememberedEmail) {
          localStorage.setItem("rememberedEmail", rememberedEmail);
        }
        navigate("/login");
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default Logout;
