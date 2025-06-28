import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import ReservationCard from "../components/ReservationCard";
import "../styles/Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState({
    current: [],
    future: [],
    cancelled: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await fetchWithToken("/verReservas");

        setReservations({
          current: data.current || [],
          future: data.future || [],
          cancelled: data.cancelled || [],
          past: data.past || []
        });
      } catch (err) {
        console.error("Error al cargar reservas:", err);

        if (err.message === "Failed to fetch" || err.message === "NetworkError") {
          setError("Error al cargar las reservas");
        } else {
          setError("Error al cargar las reservas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Nueva función para refrescar reservas tras cancelar
  const refreshReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchWithToken("/verReservas");
      setReservations(data);
    } catch (err) {
      console.error("Error al refrescar reservas:", err);

      if (err.message === "Failed to fetch" || err.message === "NetworkError") {
        setError("Error al cargar las reservas");
      } else {
        setError("Error al cargar las reservas");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="reservations-page">
          <p className="loading">Cargando reservas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="reservations-page">
          <p className="error-message">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="reservations-page">
        <h1 className="reservations-title">Reservas</h1>

        {reservations.current.length === 0 &&
        reservations.future.length === 0 &&
        reservations.cancelled.length === 0 &&
        reservations.past.length === 0 ? (
          <p className="no-reservations">No hay reservas activas</p>
        ) : (
          <>
            <div className="reservations-section">
              <h3 className="reservations-section__title">Vigentes</h3>
              {reservations.current.length > 0 ? (
                <div className="reservations-grid">
                  {reservations.current.map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancelSuccess={refreshReservations}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-reservations-message">No hay reservas vigentes.</p>
              )}
            </div>

            <div className="reservations-section">
              <h3 className="reservations-section__title">Futuras</h3>
              {(reservations.future || []).length > 0 ? (
                <div className="reservations-grid">
                  {(reservations.future || []).map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancelSuccess={refreshReservations}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-reservations-message">No hay reservas futuras.</p>
              )}
            </div>

            <div className="reservations-section">
              <h3 className="reservations-section__title">Canceladas</h3>
              {(reservations.cancelled || []).length > 0 ? (
                <div className="reservations-grid">
                  {(reservations.cancelled || []).map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancelSuccess={refreshReservations}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-reservations-message">No hay reservas canceladas.</p>
              )}
            </div>

            <div className="reservations-section">
              <h3 className="reservations-section__title">Pasadas</h3>
              {(reservations.past || []).length > 0 ? (
                <div className="reservations-grid">
                  {(reservations.past || []).map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancelSuccess={refreshReservations}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-reservations-message">No hay reservas pasadas.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Reservations;
