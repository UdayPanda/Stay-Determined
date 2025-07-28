import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import logo from "../../assets/Stay-determined-logo.png";

function NewHeader() {
  const { user } = useAuth();

  const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-b border-gray-300 shadow-sm" : ""
      }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                className="h-5 md:h-8 lg:mr-1 lg:h-12"
                alt="Logo"
              />
              <span className="font-dancing-script self-center text-xl lg:text-4xl sm:text-lg whitespace-nowrap">
                Stay Determined!
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-[#2C2627] hover:text-[#FF745C] transition-colors"
            >
              Features
            </a>
            <a
              href="#analytics"
              className="text-[#2C2627] hover:text-[#FF745C] transition-colors"
            >
              Analytics
            </a>
            <a
              href="#testimonials"
              className="text-[#2C2627] hover:text-[#FF745C] transition-colors"
            >
              Reviews
            </a>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 text-[#2C2627] hover:text-[#FF745C] transition-colors lg:p-0`
              }
            >
              About
            </NavLink>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              {user ? "Dashboard" : "Login"}
            </Link>
            <Link
              to={user ? "/" : "/signup"}
              onClick={user ? logoutUser : null}
              className="text-white bg-[#FF745C] hover:bg-[#ff6347] focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-2 lg:px-5 py-1 lg:py-2.5 mr-2 focus:outline-none"
            >
              {user ? "Logout" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NewHeader;
