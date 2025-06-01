import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";

import { DataContext } from "../../context/DataContext";

export default function Login() {
  const {
    setmenudata,
    setReports,
    setRequests,
    setNotifications,
    setTasks,
    setClosedTasks,
  } = useContext(DataContext);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/login",
        {
          username,
          password,
          language,
          hint: "standardLoginModule",
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;

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

        const currentRole = data.roles.role?.find(
          (role) => role["@category"] !== "HRREP"
        );

        if (currentRole) {
          sessionStorage.setItem(
            "current-user-ss",
            JSON.stringify(currentRole)
          );
          console.log("Stored currentRole:", currentRole);

          const roleParam = encodeURIComponent(currentRole["@name"]);
          const apiEndpoints = {
            requests: `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/requests?role=${roleParam}`,
            notifications: `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/notifications?role=${roleParam}`,
            tasks: `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/tasks?role=${roleParam}`,
            reports: `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/query?role=${roleParam}`,
            closedTasks: `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/closedtasks?role=${roleParam}`,
          };
          const fetchAllData = async () => {
            try {
              const [
                requestsRes,
                notificationsRes,
                tasksRes,
                reportsRes,
                closedTasksRes,
              ] = await Promise.all(
                Object.values(apiEndpoints).map((url) =>
                  axios.get(url, { withCredentials: true })
                )
              );
              setReports(reportsRes.data.query || []);
              setRequests(requestsRes.data.request || []);
              setNotifications(notificationsRes.data.notification || []);
              setTasks(tasksRes.data.task || []);
              setClosedTasks(closedTasksRes.data.closedTask || []);

              console.log("All API data saved.");
            } catch (error) {
              console.error("Error fetching post-login data:", error);
            }
          };

          // Call it right after gpmenu
          await fetchAllData();
          const result = await axios.get(
            `http://localhost:8181/http://dlnxhradev02.ptx.fr.sopra:37522/hr-business-services-rest/business-services/gpmenu?path=employee&role=${roleParam}`,
            {
              withCredentials: true,
            }
          );
          const menudata = result.data.topic;
          setmenudata(menudata || []);
          console.log("Initial data:", result.data.topic);
        } else {
          console.warn("No valid current role found to make API call.");
        }

        navigate("/upload?justLoggedIn=true");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your connection or credentials.");
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
                  autoComplete="username"
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
                  autoComplete="current-password"
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
              <div className="flex justify-center items-center text-white-400 hover:text-gray-100">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className="toggle border-white bg-white checked:border-white checked:bg-white-600 checked:text-black"
                />
                <label htmlFor="rememberMe" className="pl-2">
                  Remember me
                </label>
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
