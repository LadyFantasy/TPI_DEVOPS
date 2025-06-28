import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import Button1 from "../components/Button1";
import { FaArrowLeft } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/AdminForm.css";
import "../styles/BackButton.css";

function AdminForm() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    superUser: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditing = !!username;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const checkSuperAdmin = () => {
      const superAdmin = localStorage.getItem("isSuperAdmin") === "1";
      if (!superAdmin) {
        navigate("/admin");
        return false;
      }
      return true;
    };

    if (checkSuperAdmin() && isEditing) {
      loadAdminData();
    }
  }, [username, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetchWithToken("/verAdmins");
      const adminData = response[username];
      if (adminData) {
        setFormData(prev => ({
          ...prev,
          username: adminData.username,
          superUser: adminData.superUser
        }));
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError(err.message || "Error al cargar los datos del administrador");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setError("");
    const finalValue = type === "checkbox" ? (checked ? "True" : "False") : value.trim();
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      setError("El usuario debe ser un email válido");
      return;
    }

    if (!isEditing && formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!isEditing && formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        if (formData.password) {
          await fetchWithToken("/editPass", {
            method: "POST",
            body: JSON.stringify({
              password: formData.password
            })
          });
        }
      } else {
        const adminData = {
          username: formData.username,
          password: formData.password,
          superUser: formData.superUser
        };
        await fetchWithToken("/crearAdmin", {
          method: "POST",
          body: JSON.stringify(adminData)
        });
      }

      navigate("/admins");
    } catch (error) {
      setError(error.message || "Error al procesar la solicitud");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="loading">Cargando administrador...</p>
      </>
    );

  return (
    <>
      <Navbar />
      <Button1
        title={<FaArrowLeft className="back-icon" />}
        onClick={() => navigate("/admins")}
        className="back-button"
      />
      <div className="admin-form-container">
        <h2 className="admin-form__title">
          {isEditing ? "Editar administrador" : "Agregar administrador"}
        </h2>
        <form className="admin-form__form" onSubmit={handleSubmit}>
          <div className="admin-form__field">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Usuario"
              disabled={isEditing}
            />
          </div>
          {!isEditing && (
            <>
              <div className="admin-form__field" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setError("")}
                  placeholder="Contraseña"
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.6rem",
                    color: "var(--color-primary)"
                  }}
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
              <div className="admin-form__field" style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setError("")}
                  placeholder="Confirmar contraseña"
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.6rem",
                    color: "var(--color-primary)"
                  }}
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                  {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </>
          )}
          <div className="admin-form__field checkbox">
            <input
              type="checkbox"
              id="superUser"
              name="superUser"
              checked={formData.superUser === "True" || formData.superUser === true}
              onChange={handleChange}
              onFocus={() => setError("")}
            />
            <span>Super usuario</span>
          </div>
          {error && <div className="admin-form__error">{error}</div>}
          <Button1 title={isEditing ? "Guardar cambios" : "Agregar administrador"} type="submit" />
        </form>
      </div>
    </>
  );
}

export default AdminForm;
