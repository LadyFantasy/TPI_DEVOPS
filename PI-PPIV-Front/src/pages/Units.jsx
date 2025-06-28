import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UnitCard from "../components/UnitCard";
import Navbar from "../components/Navbar";
import Button1 from "../components/Button1";
import config from "../config";
import "../styles/Units.css";

export default function Units() {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const fetchUnits = async () => {
      try {
      setLoading(true);
      setError("");
        const res = await fetch(`${config.baseUrl}/api/terceros/units`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setUnits(data);
      } catch (err) {
      console.error("Error al cargar unidades:", err);
      // Mostrar mensaje amigable en lugar de errores técnicos
      if (err.message === "Failed to fetch" || err.message === "NetworkError") {
        setError("Error al cargar las unidades");
      } else if (err.message.startsWith("Error ")) {
        setError("Error al cargar las unidades");
      } else {
        setError("Error al cargar las unidades");
      }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUnits();
  }, []);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="units-page">
          <p className="loading">Cargando unidades...</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="units-page">
          <div className="units-header">
            <h2 className="units-title">Unidades</h2>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="units-page">
        <div className="units-header">
          <h2 className="units-title">Unidades</h2>
          <Button1 title="Agregar unidad" onClick={() => navigate("/units/add")} />
        </div>

        {units.length === 0 ? (
          <p>No hay unidades disponibles.</p>
        ) : (
          <div className="units-grid">
            {units.map(u => (
              <UnitCard key={u.id} unit={u} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
