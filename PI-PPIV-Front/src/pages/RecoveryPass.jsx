import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.css";
import PasswordForm from "../components/PasswordForm";
import config from "../config";
import { useAuth } from "../context/AuthContext";

function RecoveryPass() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Token no válido");
    }
  }, [searchParams]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const token = searchParams.get("token");
      const response = await fetch(`${config.baseUrl}/recoveryPass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccess("Contraseña modificada con éxito");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Error al modificar la contraseña");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <span className="login-omega">Ω</span>
        <h1 className="login-title">Omeguitas</h1>
      </div>
      <PasswordForm
        title="Recuperar Contraseña"
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={e => setPassword(e.target.value.trim())}
        onConfirmPasswordChange={e => setConfirmPassword(e.target.value.trim())}
        onSubmit={handleSubmit}
        error={error}
        success={success}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        buttonText="Cambiar Contraseña"
        loading={loading}
      />
    </div>
  );
}

export default RecoveryPass;
