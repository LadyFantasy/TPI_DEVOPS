import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import config from "../config";
import "../styles/Survey.css";
import "../styles/main.css";
import Button1 from "../components/Button1";
import SuccessModal from "../components/SuccessModal";

const questions = {
  p1: "Conformidad general con el hospedaje",
  p2: "Limpieza e higiene de la unidad",
  p3: "Ubicación y accesibilidad",
  p4: "Comodidades y equipamiento",
  p5: "Calidad-precio del alojamiento"
};

function Survey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState({ p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 });
  const [hover, setHover] = useState({ p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (Object.values(ratings).some(rating => rating === 0)) {
      setError("Por favor, complete todas las preguntas.");
      return;
    }

    setLoading(true);
    try {
      const payload = { id: parseInt(id, 10), ...ratings };
      console.log("Enviando payload:", payload);
      const response = await fetch(`${config.baseUrl}/encuesta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.status === 201) {
        setShowSuccess(true);
        return;
      }

      if (!response.ok) {
        if (response.status === 403) {
          setError("La encuesta ya ha sido completada.");
        } else {
          setError("Error al procesar la encuesta, intente nuevamente.");
        }
        return;
      }
    } catch {
      setError("Error al procesar la encuesta, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="survey-container">
        <SuccessModal
          title="¡Encuesta Enviada!"
          message="La encuesta se envió correctamente."
          onConfirm={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="survey-container">
      <div className="survey-card">
        <h1 className="survey-title">Encuesta de Satisfacción</h1>
        <p className="survey-subtitle">Su opinión es muy importante para nosotros.</p>
        <form onSubmit={handleSubmit} className="survey-form">
          <div className="survey-questions-container">
            {Object.entries(questions).map(([key, question]) => (
              <div key={key} className="survey-question">
                <label>{question}</label>
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={ratingValue}
                        className="star"
                        size={35}
                        color={ratingValue <= (hover[key] || ratings[key]) ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => setHover(prev => ({ ...prev, [key]: ratingValue }))}
                        onMouseLeave={() => setHover(prev => ({ ...prev, [key]: 0 }))}
                        onClick={() => setRatings(prev => ({ ...prev, [key]: ratingValue }))}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}
          <Button1
            title={loading ? "Enviando..." : "Enviar Encuesta"}
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}

export default Survey;
