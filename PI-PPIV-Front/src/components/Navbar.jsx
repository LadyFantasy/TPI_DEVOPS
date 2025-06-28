import "../styles/Navbar.css";
import { FiHome, FiLogOut } from "react-icons/fi";
import { GoPasskeyFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar__wrapper">
      <div
        className="navbar-title__wrapper"
        onClick={() => navigate("/admin")}
        style={{ cursor: "pointer" }}>
        <span className="navbar-title__logo">Ω</span>
        <h1 className="navbar-title__title">Omeguitas</h1>
      </div>
      <div className="navbar-icons__wrapper">
        <span className="navbar__home">
          <FiHome onClick={() => navigate("/admin")} />
        </span>
        <span className="navbar__key">
          <GoPasskeyFill
            onClick={() => navigate("/change-password")}
            style={{ cursor: "pointer" }}
          />
        </span>
        <span className="navbar__logout" onClick={handleLogout}>
          <FiLogOut />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
