import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("fr");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedEmail");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const headersAlpha = {
    "Content-Type": "application/json",
    Cookie:
      "com.hraccess.portal.connection.id=CbkZxKx5L4Z1Zm7Y37xIw6QS6q2vqvGXbIiSxtp9tkmtRaXmGsVJKUk57I8ma0YU; virtualSessionId=CbkZxKx5L4Z1Zm7Y37xIw6QS6q2vqvGXbIiSxtp9tkmtRaXmGsVJKUk57I8ma0YU",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const hint = "standardLoginModule";

      const response = await fetch(
        `http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password, language, hint }),
        }
      );

      const data = await response.json();

      if (data.status === "OK") {
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify(data.userDescription)
        );
        sessionStorage.setItem("allUsers", JSON.stringify(data.roles));

        if (data.APP_CONFIG?.DOMAIN_URL) {
          sessionStorage.setItem("DOMAIN_URL", data.APP_CONFIG.DOMAIN_URL);
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", username);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Find the current role excluding HRREP category
        const currentRole = data.roles.role?.find(
          (role) => role["@category"] !== "HRREP"
        );

        if (currentRole) {
          sessionStorage.setItem(
            "current-user-ss",
            JSON.stringify(currentRole)
          );
          console.log("Stored currentRole:", currentRole);

          const baseUrl =
            "http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/gpmenu";

          // Access '@name' correctly
          const roleParam = encodeURIComponent(currentRole["@name"]);
          const finalUrl = `${baseUrl}?path=employee&role=${roleParam}`;

          console.log("Calling API with URL:", finalUrl);

          fetch(finalUrl, {
            method: "GET",
            headers: headersAlpha,
            credentials: "include",
          })
            .then((res) => res.json())
            .then((result) => {
              console.log("Initial data:", result);
            })
            .catch((err) => {
              console.error("API call failed:", err);
            });
        } else {
          console.warn("No valid current role found to make API call.");
        }

        navigate("/upload");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <section className="min-h-screen flex items-stretch text-white">
      <div
        className="lg:flex w-1/2 hidden bg-no-repeat bg-center bg-cover relative items-center"
        style={{ backgroundImage: "url(/images/bg_login.png)" }}
      >
        <div className="absolute bg-black opacity-60 "></div>
      </div>

      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{ backgroundColor: "#161616" }}
      >
        <div
          className="absolute lg:hidden z-10 inset-0 bg-no-repeat bg-center bg-cover items-center"
          style={{ backgroundImage: "url(/images/bg_login.png)" }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        <div className="w-full py-6 z-20">
          <div className="w-full z-10 flex items-center justify-end">
            <h1
              className="text-2xl font-semibold tracking-wide pl-2 hover:text-[#FFCA23]"
              style={{
                fontFamily: "Hurme Geometric Sans 3, sans-serif",
                fontWeight: 300,
              }}
            >
              Together, we shape the future.
            </h1>
            <img src="/images/logosopra.png" alt="Logo" className="h-16" />
          </div>

          <div className="py-6 space-x-2"></div>

          {error && (
            <div className="text-sm text-red-500 mb-3 text-center">{error}</div>
          )}

          <div className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="pb-2 pt-4">
                <input
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <select
                  name="language"
                  id="language"
                  className="block w-full bg-black text-white select select-md"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                </select>
              </div>
              <div className="flex justify-center items-center text-white-400 background-white hover:text-gray-100">
                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className="toggle border-white bg-white checked:border-white checked:bg-white-600 checked:text-black"
                />
                <p className="pl-2">Remember me</p>
              </div>

              <div className="pb-2 pt-4">
                <button
                  type="submit"
                  className="btn btn-neutral w-full text-white text-lg btn-outline bg-black hover:bg-white hover:text-black transition duration-200 ease-in-out"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
