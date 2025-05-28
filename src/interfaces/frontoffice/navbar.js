import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [roles, setRoles] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("allUsers");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.role)) {
          const filtered = parsed.role.filter(
            (role) => role["@category"] !== "HRREP"
          );
          setRoles(filtered);
          if (
            filtered.length > 0 &&
            !sessionStorage.getItem("current-user-ss")
          ) {
            sessionStorage.setItem(
              "current-user-ss",
              JSON.stringify(filtered[0])
            );
          }
        } else {
          console.error("Expected 'role' to be an array in allUsers");
        }
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

  return (
    <div>
      <div
        className={`navbar sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-transparent" : "bg-neutral"
        }`}
      >
        <div className="flex-1">
          <a href="/upload">
            <img
              src="/images/logosopra.png"
              alt="Logo"
              className="btn btn-warning btn-ghost text-xl"
            />
          </a>
        </div>
        <div className="flex gap-2  items-center">
          {/* Paper Plane Icon */}
          <button className="btn btn-square btn-ghost btn-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 2.25L11.25 12.75"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 2.25L14.25 21.75L11.25 12.75L2.25 9.75L21.75 2.25Z"
              />
            </svg>
          </button>

          {/* Bell Icon */}
          <button className="btn btn-square btn-ghost btn-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
         c0-3.038-1.343-5.443-4-5.917V4a2 2 0 00-4 0v1.083
         C7.343 5.557 6 7.962 6 11v3.159c0 .538-.214 1.055-.595
         1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* Message Icon (Envelope) */}
          <button className="btn btn-square btn-ghost btn-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5A2.25 2.25 0 0119.5
        19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m0
        0l9 6.75 9-6.75m-18 0A2.25 2.25 0 014.5
        4.5h15a2.25 2.25 0 012.25 2.25"
              />
            </svg>
          </button>

          {/* Document Icon */}
          <button className="btn btn-square btn-ghost btn-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="size-[1.2em]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 4H7a2 2 0
        01-2-2V6a2 2 0 012-2h7l5
        5v11a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              className="btn btn-warning btn-ghost text-white text-xs"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Mes Rôles
            </button>
            {dropdownOpen && (
              <ul className="absolute right-0 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-64 mt-2 z-50">
                {roles.map((role, index) => (
                  <li key={index}>
                    <a
                      href="/upload"
                      onClick={() => {
                        sessionStorage.setItem(
                          "current-user-ss",
                          JSON.stringify(role)
                        );
                        setDropdownOpen(false);
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
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
      </div>
    </div>
  );
};

export default Navbar;
