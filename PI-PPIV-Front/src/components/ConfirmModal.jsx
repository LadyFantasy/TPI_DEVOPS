//components/ConfirmModal.jsx
import "../styles/modal.css";
import Button1 from "./Button1";

export default function ConfirmModal({ text, error, onConfirm, onCancel, loading }) {
  return (
    <div className="overlay">
      <div className="modal">
        <p>{text}</p>
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <Button1
            title={loading ? "Confirmando..." : "Confirmar"}
            onClick={onConfirm}
            disabled={loading}
          />
          <Button1 title="Cancelar" className="danger" onClick={onCancel} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
