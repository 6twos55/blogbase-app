import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import navLogo from "../styles/logo_dark.svg";
import { useAuth } from "../context/AuthContext";
import AccountModal from "./AccountModal";
import { FaSun, FaMoon, FaUserCog, FaCrown } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blogbase_theme") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("blogbase_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    } else {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <nav className="navContainer">
        <Link to="/" className="appName" title="BlogBase Home">
          <img src={navLogo} alt="BlogBase Logo" />
        </Link>

        <div className="navLinks">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btnThemeToggle"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun className="themeIcon sunIcon" /> : <FaMoon className="themeIcon moonIcon" />}
          </button>

          {user ? (
            <>
              {/* Account Dropdown / Settings trigger */}
              <button
                type="button"
                className="userProfileTrigger"
                onClick={() => setIsAccountModalOpen(true)}
                title="Account Settings & Profile"
              >
                <div className="navAvatar">
                  {user.username.slice(0, 1).toUpperCase()}
                </div>
                <span className="userGreeting">
                  Hi, {user.username}
                  {user.isAdmin && (
                    <FaCrown size={12} className="adminCrown" title="Admin Account" />
                  )}
                </span>
                <FaUserCog size={13} className="settingsIcon" />
              </button>

              <Link to="/add_media" className="addMedia">
                Add Blog
              </Link>
              <button onClick={logout} className="btnLogout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="authLink">
                Login
              </Link>
              <Link to="/register" className="authLink btnRegister">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Account Settings Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
};

export default Navbar;