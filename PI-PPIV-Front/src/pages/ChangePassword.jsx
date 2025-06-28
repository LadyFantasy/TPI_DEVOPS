import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PasswordForm from "../components/PasswordForm";
import SuccessModal from "../components/SuccessModal";
import { fetchWithToken } from "../utils/fetchWithToken";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await fetchWithToken("/editPass", {
        method: "POST",
        body: JSON.stringify({ password })
      });
      setShowSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="changepassword-bg">
        <div className="changepassword-border">
          <PasswordForm
            title="Cambiar contraseña"
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={e => setPassword(e.target.value.trim())}
            onConfirmPasswordChange={e => setConfirmPassword(e.target.value.trim())}
            onSubmit={handleSubmit}
            error={error}
            success={null}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            buttonText="Cambiar contraseña"
            loading={loading}
          />
          {showSuccess && (
            <SuccessModal
              message="Contraseña cambiada exitosamente."
              onConfirm={() => {
                setShowSuccess(false);
                navigate("/admin-panel");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
