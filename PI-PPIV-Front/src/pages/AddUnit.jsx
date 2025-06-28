import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import PhotoCarousel from "../components/PhotoCarousel";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import AmenitiesSelector from "../components/AmenitiesSelector";
import Button1 from "../components/Button1";
import { FaArrowLeft } from "react-icons/fa";
import placeholder from "../assets/casita.jpg";
import { ALL_AMENITIES } from "../constants/amenities";
import "../styles/UnitDetail.css";
import "../styles/BackButton.css";

function AddUnit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    rooms: 1,
    beds: 1,
    bathrooms: 1,
    urls_fotos: ""
  });
  const [amenities, setAmenities] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear all validation errors when user touches any input
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  };

  const handleFocus = () => {
    // Clear all validation errors when user focuses on any field
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  };

  const handleNewPhoto = newUrl => {
    const currentUrls = formData.urls_fotos
      ? formData.urls_fotos
          .split(",")
          .map(u => u.trim())
          .filter(u => u.length > 0)
      : [];
    const updatedUrls = [...currentUrls, newUrl];
    setFormData(prev => ({
      ...prev,
      urls_fotos: updatedUrls.join(",")
    }));
  };

  const dataToSend = {
    address: formData.address,
    title: formData.title,
    rooms: Number(formData.rooms),
    beds: Number(formData.beds),
    bathrooms: Number(formData.bathrooms),
    description: formData.description,
    price: Number(formData.price),
    amenities: amenities.join(","),
    urls_fotos: formData.urls_fotos ? formData.urls_fotos.trim() : ""
  };

  const confirmAction = async () => {
    try {
      await fetchWithToken("/creaUnidad", {
        method: "POST",
        body: JSON.stringify(dataToSend)
      });
      setModal(null);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "El título es requerido";
    }
    if (!formData.address.trim()) {
      errors.address = "La dirección es requerida";
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = "El precio es requerido y debe ser mayor a 0";
    }
    if (!formData.rooms || formData.rooms < 1) {
      errors.rooms = "El número de habitaciones es requerido";
    }
    if (!formData.beds || formData.beds < 1) {
      errors.beds = "El número de camas es requerido";
    }
    if (!formData.bathrooms || formData.bathrooms < 1) {
      errors.bathrooms = "El número de baños es requerido";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUnit = () => {
    if (validateForm()) {
      setModal("create");
    }
  };

  const fotos = formData.urls_fotos
    ? formData.urls_fotos
        .split(",")
        .map(f => f.trim())
        .filter(f => f !== "")
    : [placeholder];

  return (
    <>
      <Navbar />
      <Button1
        title={<FaArrowLeft className="back-icon" />}
        onClick={() => navigate("/units")}
        className="back-button"
      />
      <div className="unit-detail">
        <h2 className="unit-detail__title">Agregar nueva unidad</h2>
        <div className="unit-detail__wrapper">
          <PhotoCarousel fotos={fotos} onUploadSuccess={handleNewPhoto} />

          <div className="unit-detail__inputs">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título"
              className="unit-input"
              required
              onFocus={handleFocus}
            />
            {validationErrors.title && (
              <div className="error-message">{validationErrors.title}</div>
            )}
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="unit-input"
              onFocus={handleFocus}
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección"
              className="unit-input"
              required
              onFocus={handleFocus}
            />
            {validationErrors.address && (
              <div className="error-message">{validationErrors.address}</div>
            )}
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Precio"
              className="unit-input"
              required
              onFocus={handleFocus}
            />
            {validationErrors.price && (
              <div className="error-message">{validationErrors.price}</div>
            )}
            <div className="unit-detail__numeric-group">
              {["rooms", "beds", "bathrooms"].map(field => (
                <div key={field} className="numeric-input">
                  <label className="numeric-label">
                    {field === "rooms" ? "Habitaciones" : field === "beds" ? "Camas" : "Baños"}
                  </label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="numeric-select"
                    required
                    onFocus={handleFocus}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  {validationErrors[field] && (
                    <div className="error-message">{validationErrors[field]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AmenitiesSelector all={ALL_AMENITIES} selected={amenities} onChange={setAmenities} />
        </div>

        <div className="unit-detail__buttons">
          <Button1 title="Crear unidad" onClick={handleCreateUnit} />
        </div>

        {modal && (
          <ConfirmModal
            text="¿Desea crear esta nueva unidad?"
            error={error}
            onConfirm={confirmAction}
            onCancel={() => setModal(null)}
          />
        )}

        {success && (
          <SuccessModal
            message="La unidad se ha creado correctamente"
            onClose={() => {
              setSuccess(false);
              navigate("/units");
            }}
          />
        )}
      </div>
    </>
  );
}

export default AddUnit;
