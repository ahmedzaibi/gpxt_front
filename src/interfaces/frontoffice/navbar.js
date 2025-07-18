import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickTasks = () => navigate("/tasks");
  const handleClickNotifications = () => navigate("/notification");
  const handleClickRequests = () => navigate("/request");
  const handleClickReports = () => navigate("/report");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("allUsers");
      const adminRole = { "@label": "Admin", "@category": "ADMIN" };

      let allRoles = [adminRole];

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role) {
          const rolesArray = Array.isArray(parsed.role)
            ? parsed.role
            : [parsed.role];
          const filtered = rolesArray.filter(
            (role) => role["@category"] !== "HRREP"
          );
          allRoles = [adminRole, ...filtered];
        } else {
          console.error("Expected 'role' to be an array in allUsers");
        }
      }

      setRoles(allRoles);

      if (!sessionStorage.getItem("current-user-ss")) {
        sessionStorage.setItem("current-user-ss", JSON.stringify(allRoles[0]));
      }
    } catch (err) {
      console.error("Error parsing roles from sessionStorage", err);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // --- NEW: Function to handle role selection ---
  const handleRoleChange = (role) => {
    // 1. Set the selected role in sessionStorage
    sessionStorage.setItem("current-user-ss", JSON.stringify(role));

    // 2. Close the dropdown
    setDropdownOpen(false);

    // 3. Apply navigation logic
    if (role["@label"] === "Admin") {
      navigate("/gpm"); // Redirect to /gpm for Admin
    } else {
      window.location.reload(); // Refresh the page for any other role
    }
  };

  return (
    <div>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 flex items-center px-4 py-2 ease-in-out bg-white/10 backdrop-blur-sm text-white h-full`}
      >
        <div className="flex-none flex items-center gap-3">
          <button href="#" className="btn btn-warning btn-ghost text-xl p-0">
            <img src="/images/logosopra.png" alt="Logo" className="h-10" />
          </button>
        </div>

        <div className="flex-1"></div>

        <div className="flex gap-2 items-center">
          {/* Your icon buttons */}
          <button
            className="btn btn-square btn-ghost btn-warning"
            onClick={handleClickRequests}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="w-6 h-6"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 2.25L11.25 12.75"
              />{" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 2.25L14.25 21.75L11.25 12.75L2.25 9.75L21.75 2.25Z"
              />{" "}
            </svg>
          </button>
          <button
            className="btn btn-square btn-ghost btn-warning"
            onClick={handleClickNotifications}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="w-6 h-6"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11 c0-3.038-1.343-5.443-4-5.917V4a2 2 0 00-4 0v1.083 C7.343 5.557 6 7.962 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />{" "}
            </svg>
          </button>
          <button
            className="btn btn-square btn-ghost btn-warning"
            onClick={handleClickTasks}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="w-6 h-6"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m0 0l9 6.75 9-6.75m-18 0A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25"
              />{" "}
            </svg>
          </button>
          <button
            className="btn btn-square btn-ghost btn-warning"
            onClick={handleClickReports}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="w-6 h-6"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
              />{" "}
            </svg>
          </button>
        </div>

        <div className="mx-4 w-px h-6 bg-gray-400 opacity-40"></div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              className="btn btn-warning btn-ghost text-white text-xs"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Mes Rôles
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-64 mt-2 z-50 text-[#7E00B5]">
                {roles.map((role, index) => (
                  <li key={index}>
                    {/* --- UPDATED: a tag with new onClick --- */}
                    <a
                      href="#" // Use a neutral href to prevent unwanted navigation
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the link's default behavior
                        handleRoleChange(role); // Call the new handler function
                      }}
                    >
                      {role["@label"]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow text-black"
            >
              <li>
                <a href="/Profile">Profile</a>
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
