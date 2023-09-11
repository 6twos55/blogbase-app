import { Link } from "react-router-dom";
import navLogo from "../styles/logo_dark.png";

const Navbar = () => {

  return(
    <nav className="navContainer">
      <Link to="/" className="appName"><img src={navLogo} alt="" /></Link>
      <div className="navLinks">
        <Link to="/add_media" className="addMedia">Add blog</Link>
      </div>
    </nav>
  );

}

export default Navbar;