import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MultiplierRow from "./MultiplierRow";
import "../styles/PriceMultiplier.css";
/* import { fetchWithToken } from "../utils/fetchWithToken"; */
import config from "../config";

function PriceMultiplier() {
  const { user } = useAuth();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.baseUrl}/api/price-multiplier`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al cargar los multiplicadores");
      }

      const data = await response.json();
      setRates(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRate = () => {
    setRates([
      ...rates,
      {
        since: null,
        until: null,
        multiplier: 1
      }
    ]);
  };

  const handleDateRangeChange = (index, dates) => {
    const [start, end] = dates;
    const newRates = [...rates];
    newRates[index] = {
      ...newRates[index],
      since: start,
      until: end
    };

    // Verificar solapamiento
    const hasOverlap = newRates.some((rate, i) => {
      if (i === index) return false;
      if (!rate.since || !rate.until || !start || !end) return false;

      return (
        (start <= rate.until && end >= rate.since) || (rate.since <= end && rate.until >= start)
      );
    });

    if (hasOverlap) {
      setError("El rango de fechas se solapa con otro período existente");
      return;
    }

    setError(null);
    setRates(newRates);
  };

  const handleMultiplierChange = (index, value) => {
    const newRates = [...rates];
    newRates[index] = {
      ...newRates[index],
      multiplier: parseFloat(value)
    };
    setRates(newRates);
  };

  const handleRemoveRate = index => {
    const newRates = rates.filter((_, i) => i !== index);
    setRates(newRates);
  };

  const handleSaveRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.baseUrl}/api/price-multiplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(rates)
      });

      if (!response.ok) {
        throw new Error("Error al guardar los multiplicadores");
      }

      alert("Multiplicadores guardados exitosamente");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar los multiplicadores");
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date, currentIndex) => {
    return !rates.some((rate, index) => {
      if (index === currentIndex) return false;
      if (!rate.since || !rate.until) return false;
      return date >= rate.since && date <= rate.until;
    });
  };

  return (
    <div className="price-multiplier">
      <div className="price-multiplier__content">
        <h1>Configuración de Multiplicadores de Precio</h1>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Cargando multiplicadores...</div>
        ) : (
          <>
            {rates.length === 0 ? (
              <div className="price-multiplier__empty-state">No hay períodos configurados</div>
            ) : (
              rates.map((rate, index) => (
                <MultiplierRow
                  key={index}
                  rate={rate}
                  index={index}
                  onDateRangeChange={handleDateRangeChange}
                  onMultiplierChange={handleMultiplierChange}
                  onRemove={handleRemoveRate}
                  isDateAvailable={isDateAvailable}
                />
              ))
            )}
            <div className="price-multiplier__actions">
              <button className="price-multiplier__add-button" onClick={handleAddRate}>
                Agregar Período
              </button>
              <button className="price-multiplier__add-button" onClick={handleSaveRates}>
                Guardar Cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PriceMultiplier;
