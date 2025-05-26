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
