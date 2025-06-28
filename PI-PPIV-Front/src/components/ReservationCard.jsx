import "../styles/Reservations.css";
import { useState } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import ConfirmModal from "./ConfirmModal";
import SuccessModal from "./SuccessModal";

function ReservationCard({ reservation, onCancelSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPast = new Date(reservation.Salida) < new Date();
  const cardClass = `reservation-card ${isPast ? "past-reservation" : ""}`;

  const handleCancel = () => {
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    setLoading(true);
    setError("");
    try {
      await fetchWithToken(`/cancelarReserva?id=${reservation.id}`);
      setShowConfirm(false);
      setShowSuccess(true);
      if (onCancelSuccess) onCancelSuccess();
    } catch (err) {
      setError(err.message || "Error al cancelar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cardClass}>
      <div className="reservation-card__image">
        <img src={reservation.Foto} alt={reservation.Unidad} />
      </div>
      <div className="reservation-card__content">
        <div className="reservation-card__header">
          <h3 className="reservation-card__title">{reservation.Unidad}</h3>
        </div>
        <div className="reservation-card__dates">
          <p className="reservation-card__label">Período de estadía</p>
          <p>
            Del {reservation.Ingreso} al {reservation.Salida}
          </p>
        </div>
        <div className="reservation-card__guest">
          <p className="reservation-card__label">Datos del huésped</p>
          <p>{reservation.name}</p>
          <p>{reservation.email}</p>
        </div>
        <div className="reservation-card__payment">
          <p className="reservation-card__label">Información de pago</p>
          <p>Total: ${reservation.Total}</p>
          <p>Pagado: ${reservation.Pagado}</p>
        </div>
        <div className="reservation-card__footer">
          {!reservation.canceled && !isPast && (
            <button
              className="reservation-card__cancel-btn"
              onClick={handleCancel}
              disabled={loading}>
              {loading ? "Cancelando..." : "Cancelar reserva"}
            </button>
          )}
          <span className="reservation-card__id">ID: {reservation.id}</span>
        </div>
        {reservation.checked_in === 1 && (
          <div className="reservation-card__status">
            <span className="status-badge">Check-in realizado</span>
          </div>
        )}
      </div>
      {showConfirm && (
        <ConfirmModal
          text="¿Está seguro que desea cancelar esta reserva?"
          error={error}
          onConfirm={confirmCancel}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
      {showSuccess && (
        <SuccessModal
          title="Reserva cancelada"
          message="La reserva ha sido cancelada correctamente."
          onConfirm={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}

export default ReservationCard;
