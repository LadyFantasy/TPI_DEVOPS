import { FiEye, FiEyeOff } from "react-icons/fi";
import Button1 from "./Button1";

function PasswordForm({
  title,
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  error,
  success,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  buttonText = "Guardar contraseña",
  loading = false
}) {
  return (
    <div className="login-login">
      <h2 className="login-login__title">{title}</h2>
      <form onSubmit={onSubmit} className="login-form">
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña..."
            value={password}
            onChange={onPasswordChange}
            required
            className="login-input login-input-top"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
        <div className="login-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar contraseña..."
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            required
            className="login-input login-input-bottom"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(prev => !prev)}
            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
            {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}
        <Button1 type="submit" title={loading ? "Guardando..." : buttonText} disabled={loading} />
      </form>
    </div>
  );
}

export default PasswordForm;
