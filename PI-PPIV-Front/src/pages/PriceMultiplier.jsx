import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import Button1 from "../components/Button1";
import SuccessModal from "../components/SuccessModal";
import MultiplierRow from "../components/MultiplierRow";
import SeasonCalendar from "../components/SeasonCalendar";
import { format } from "date-fns";
import "../styles/PriceMultiplier.css";
import ConfirmModal from "../components/ConfirmModal";

function PriceMultiplier() {
  const [seasonRates, setSeasonRates] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSeasonRates();
  }, []);

  const fetchSeasonRates = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchWithToken("/motor");

      if (!data || !Array.isArray(data)) {
        setSeasonRates([]);
        return;
      }

      const mappedRates = data.map(rate => ({
        since: rate.since ? new Date(rate.since) : null,
        until: rate.until ? new Date(rate.until) : null,
        multiplier: rate.multiplier ? Number(rate.multiplier) : 1
      }));

      setSeasonRates(mappedRates);
    } catch {
      setError("Error al cargar los multiplicadores");
      setSeasonRates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRate = () => {
    setSeasonRates([...seasonRates, { since: null, until: null, multiplier: 1 }]);
  };

  const handleRemoveRate = index => {
    setSeasonRates(seasonRates.filter((_, i) => i !== index));
  };

  const handleDateRangeChange = (index, dates) => {
    const [start, end] = dates;

    // Si no hay fecha de inicio o fin, permitir la selección
    if (!start || !end) {
      const newRates = [...seasonRates];
      newRates[index].since = start;
      newRates[index].until = end;
      setSeasonRates(newRates);
      setError("");
      return;
    }

    // Crear nuevas instancias de Date y normalizar
    const newStart = new Date(start);
    const newEnd = new Date(end);
    newStart.setHours(0, 0, 0, 0);
    newEnd.setHours(0, 0, 0, 0);

    // Verificar que la fecha de fin sea posterior a la fecha de inicio
    if (newEnd < newStart) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Verificar solapamientos con otros rangos
    const hasOverlap = seasonRates.some((rate, i) => {
      if (i === index || !rate.since || !rate.until) return false;

      const existingStart = new Date(rate.since);
      const existingEnd = new Date(rate.until);
      existingStart.setHours(0, 0, 0, 0);
      existingEnd.setHours(0, 0, 0, 0);

      return (
        // El nuevo rango está completamente dentro de otro rango
        (newStart >= existingStart && newEnd <= existingEnd) ||
        // El nuevo rango contiene completamente a otro rango
        (newStart <= existingStart && newEnd >= existingEnd) ||
        // El inicio del nuevo rango está dentro de otro rango
        (newStart >= existingStart && newStart <= existingEnd) ||
        // El fin del nuevo rango está dentro de otro rango
        (newEnd >= existingStart && newEnd <= existingEnd)
      );
    });

    if (hasOverlap) {
      setError("El rango de fechas se solapa con otro período existente");
      return;
    }

    // Si no hay solapamiento, actualizar el estado
    const newRates = [...seasonRates];
    newRates[index].since = newStart;
    newRates[index].until = newEnd;
    setSeasonRates(newRates);
    setError("");
  };

  const handleMultiplierChange = (index, value) => {
    const newRates = [...seasonRates];
    newRates[index].multiplier = Number(value);
    setSeasonRates(newRates);
    setError("");
  };

  const validateRates = () => {
    if (seasonRates.length === 0) {
      setError("Por favor agregue al menos un período");
      return false;
    }

    for (let i = 0; i < seasonRates.length; i++) {
      const rate = seasonRates[i];
      const isLastRate = i === seasonRates.length - 1;
      const isLastRateEmpty = !rate.since && !rate.until && rate.multiplier === 1;

      if (isLastRate && isLastRateEmpty) {
        continue;
      }

      if (!rate.since || !rate.until) {
        setError("Por favor complete todas las fechas");
        return false;
      }
      if (rate.since > rate.until) {
        setError("La fecha de inicio debe ser anterior a la fecha de fin");
        return false;
      }
      if (!rate.multiplier || rate.multiplier <= 0) {
        setError("El multiplicador debe ser mayor a 0");
        return false;
      }
    }
    return true;
  };

  const handleSaveRates = async () => {
    setIsSaving(true);
    try {
      setError("");

      if (!validateRates()) {
        return;
      }

      const ratesToSubmit = seasonRates.filter((rate, index) => {
        const isLastRate = index === seasonRates.length - 1;
        const isLastRateEmpty = !rate.since && !rate.until && rate.multiplier === 1;
        return !(isLastRate && isLastRateEmpty);
      });

      const dataToSend = ratesToSubmit.map(rate => [
        format(rate.since, "yyyy-MM-dd"),
        format(rate.until, "yyyy-MM-dd"),
        rate.multiplier
      ]);

      const response = await fetchWithToken("/motor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      await fetchSeasonRates();
      setShowSuccessModal(true);
      setError("");
    } catch (error) {
      setError(error.message || "Error al actualizar los multiplicadores");
      setShowSuccessModal(false);
    } finally {
      setIsSaving(false);
      setShowConfirmModal(false);
    }
  };

  const isDateAvailable = (date, currentIndex) => {
    if (!date) return true;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Obtener el rango actual que se está editando
    const currentRate = seasonRates[currentIndex];
    const currentStart = currentRate.since ? new Date(currentRate.since) : null;
    const currentEnd = currentRate.until ? new Date(currentRate.until) : null;

    // Si estamos validando una fecha de inicio
    if (currentStart && !currentEnd) {
      return !seasonRates.some((rate, index) => {
        if (index === currentIndex || !rate.since || !rate.until) return false;

        const startDate = new Date(rate.since);
        const endDate = new Date(rate.until);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return checkDate >= startDate && checkDate <= endDate;
      });
    }

    // Si estamos validando una fecha de fin
    if (currentStart && currentEnd) {
      const newStart = new Date(currentStart);
      const newEnd = new Date(currentEnd);
      newStart.setHours(0, 0, 0, 0);
      newEnd.setHours(0, 0, 0, 0);

      // Verificar que la fecha de fin sea posterior a la fecha de inicio
      if (newEnd < newStart) return false;

      return !seasonRates.some((rate, index) => {
        if (index === currentIndex || !rate.since || !rate.until) return false;

        const startDate = new Date(rate.since);
        const endDate = new Date(rate.until);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return (
          // El nuevo rango está completamente dentro de otro rango
          (newStart >= startDate && newEnd <= endDate) ||
          // El nuevo rango contiene completamente a otro rango
          (newStart <= startDate && newEnd >= endDate) ||
          // El inicio del nuevo rango está dentro de otro rango
          (newStart >= startDate && newStart <= endDate) ||
          // El fin del nuevo rango está dentro de otro rango
          (newEnd >= startDate && newEnd <= endDate)
        );
      });
    }

    // Si estamos validando una fecha individual
    return !seasonRates.some((rate, index) => {
      if (index === currentIndex || !rate.since || !rate.until) return false;

      const startDate = new Date(rate.since);
      const endDate = new Date(rate.until);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="price-multiplier">
          <div className="loading">Cargando multiplicadores...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="price-multiplier">
        <h1 className="price-multiplier__title">Multiplicadores por períodos</h1>

        <div className="price-multiplier__content">
          {seasonRates.map((rate, index) => (
            <MultiplierRow
              key={index}
              rate={rate}
              index={index}
              isLast={index === seasonRates.length - 1}
              onDateRangeChange={handleDateRangeChange}
              onMultiplierChange={handleMultiplierChange}
              onRemove={handleRemoveRate}
              onAdd={handleAddRate}
              isDateAvailable={isDateAvailable}
            />
          ))}

          {seasonRates.length === 0 && (
            <div className="price-multiplier__empty-state">
              <Button1 title="Agregar período" onClick={handleAddRate} />
            </div>
          )}

          <div className="price-multiplier__actions">
            <Button1 title="Agregar Período" onClick={handleAddRate} />
            <Button1 title="Guardar Cambios" onClick={() => setShowConfirmModal(true)} />
          </div>

          <SeasonCalendar rates={seasonRates} />
        </div>

        {showSuccessModal && (
          <SuccessModal
            message="Los multiplicadores han sido actualizados correctamente"
            onClose={() => setShowSuccessModal(false)}
          />
        )}
        {error && <div className="error-message">{error}</div>}

        {showConfirmModal && (
          <ConfirmModal
            text="¿Está seguro que desea guardar los cambios?"
            onConfirm={handleSaveRates}
            onCancel={() => setShowConfirmModal(false)}
            loading={isSaving}
          />
        )}
      </div>
    </>
  );
}

export default PriceMultiplier;
