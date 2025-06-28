//components/ConfirmModal.jsx

import { useState } from "react";
import "../styles/modal.css";
import Button1 from "./Button1";

export default function SuccessModal({
  message,
  onConfirm,
  onClose,
  onCancel,
  showCancelButton = false,
  title,
  buttonText = "Aceptar",
  buttonDisabled = false
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleConfirm = () => {
    setIsVisible(false);
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="modal">
        {title && <h3>{title}</h3>}
        <p>{message}</p>
        <div className="modal-buttons">
          {showCancelButton && <Button1 title="Cancelar" onClick={handleCancel} />}
          <Button1 title={buttonText} onClick={handleConfirm} disabled={buttonDisabled} />
        </div>
      </div>
    </div>
  );
}
