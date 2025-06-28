import { Link } from "react-router-dom";
import placeholder from "../assets/casita.jpg";
import "../styles/UnitCard.css";

export default function UnitCard({ unit }) {
  // Usa la primera URL de fotos si existe, si no la de placeholder
  const foto = unit.urls_fotos?.split(",")[0] || placeholder;

  return (
    <Link to={`/units/${unit.id}`} state={{ unit }} className="unit-card">
      <img src={foto} alt="Foto alojamiento" className="unit-card__img" />

      <div className="unit-card__info">
        <h3 className="unit-card__title">{unit.title || "Sin título"}</h3>
        <div className="unit-card__details">
          <p className="unit-card__price">${parseFloat(unit.price).toFixed(2)}</p>
          <p className="unit-card__rooms">
            {unit.rooms} {unit.rooms === 1 ? "habitación" : "habitaciones"}
          </p>
        </div>
        <p className="unit-card__address">{unit.address || "Sin dirección"}</p>
      </div>
    </Link>
  );
}
