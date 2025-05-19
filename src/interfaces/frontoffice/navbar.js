import { useEffect, useState } from "react";

const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
<div className={`navbar sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-transparent' : 'bg-neutral'}`}>
      <div className="flex-1">
        <a href="/upload"><img  src="/images/logosopra.png" alt="Logo" className="btn btn-warning btn-ghost text-xl" /></a>
      </div>
      <div className="flex gap-2">
        
       
       
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Not Found"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/Profile" className="justify-between">
                Profile
                
              </a>
            </li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
