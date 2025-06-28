// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button1 from "../components/Button1";
import config from "../config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.status === 200) {
        await login(username, data.access_token, data.superUser);
        navigate("/admin");
      } else if (response.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Error inesperado del servidor");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleRecoveryPassword = async () => {
    if (!username) {
      setError("Por favor ingrese su email para recuperar la contraseña");
      return;
    }

    try {
      const response = await fetch(
        `${config.baseUrl}/recoveryPass?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        setRecoveryMessage("Recibirás un correo con un link para modificar tu contraseña");
        setError("");
      } else {
        setError("Error al procesar la solicitud de recuperación");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <span className="login-omega">Ω</span>
        <h1 className="login-title">Omeguitas</h1>
      </div>

      <div className="login-login">
        <h2 className="login-login__title">Bienvenido</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Tu email..."
            value={username}
            onChange={e => setUsername(e.target.value.trim())}
            onFocus={() => {
              setError("");
              setRecoveryMessage("");
            }}
            required
            className="login-input login-input-top"
          />
          <div className="login-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña..."
              value={password}
              onChange={e => setPassword(e.target.value.trim())}
              onFocus={() => {
                setError("");
                setRecoveryMessage("");
              }}
              required
              className="login-input login-input-bottom"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {error && <p className="login-error">{error}</p>}
          {recoveryMessage && <p className="login-success">{recoveryMessage}</p>}
          <Button1 type="submit" title="Ingresar" />
        </form>
        <h4 className="login-login_pass" onClick={handleRecoveryPassword}>
          Olvidé mi contraseña
        </h4>
      </div>
    </div>
  );
}

export default Login;
