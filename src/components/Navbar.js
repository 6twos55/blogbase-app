import { Link } from "react-router-dom";
import navLogo from "../styles/logo_dark.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navContainer">
      <Link to="/" className="appName">
        <img src={navLogo} alt="BlogBase Logo" />
      </Link>
      <div className="navLinks">
        {user ? (
          <>
            <span className="userGreeting">Hi, {user.username}!</span>
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
  );
};

export default Navbar;