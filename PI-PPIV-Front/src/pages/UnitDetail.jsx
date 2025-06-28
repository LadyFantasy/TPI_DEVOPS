// src/pages/UnitDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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

export default function UnitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [formData, setFormData] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchUnit = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWithToken(`/api/terceros/units/?id=${id}`);
      if (Array.isArray(data) && data.length > 0) {
        setUnit(data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener la unidad:", err);
      navigate("/units");
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUnit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (unit) {
      setFormData({
        ...unit,
        title: unit.title || "",
        address: unit.address || "",
        bathrooms: unit.bathrooms || 1,
        urls_fotos: unit.urls_fotos || ""
      });
      const cleanAmenities = unit.amenities
        ? unit.amenities
            .replace(/\\/g, "")
            .replace(/"/g, "")
            .split(",")
            .map(a => a.trim())
            .filter(a => a.length > 0)
        : [];
      setAmenities(cleanAmenities);
    }
  }, [unit]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <p>Cargando unidad...</p>
        </div>
      </>
    );
  }

  if (!formData) return null;

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

  const handleModifyUnit = () => {
    if (validateForm()) {
      setModal("edit");
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

  const handleDeletePhoto = photoUrl => {
    const currentUrls = formData.urls_fotos
      ? formData.urls_fotos
          .split(",")
          .map(u => u.trim())
          .filter(u => u.length > 0)
      : [];
    const updatedUrls = currentUrls.filter(url => url !== photoUrl);
    setFormData(prev => ({
      ...prev,
      urls_fotos: updatedUrls.join(",")
    }));
  };

  const dataToSend = {
    address: formData.address,
    id: formData.id,
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
    setLoadingConfirm(true);
    try {
      if (modal === "edit") {
        await fetchWithToken("/editarUnidad", {
          method: "POST",
          body: JSON.stringify(dataToSend)
        });
        await fetchUnit();
        setModal(null);
        setSuccess(true);
      } else if (modal === "delete") {
        await fetchWithToken("/eliminarUnidad", {
          method: "POST",
          body: JSON.stringify({ id: unit.id })
        });
        setSuccess(true);
        setIsDeleting(true);
        setModal(null);
      }
    } catch (error) {
      console.error("Error detallado:", error);
      setError(error.message || "Error al procesar la solicitud");
      setModal(null);
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetchWithToken("/eliminarUnidad", {
        method: "POST",
        body: JSON.stringify({ id: unit.id })
      });
      setSuccess(true);
      setIsDeleting(true);
      setModal(null);
      navigate("/units");
    } catch (err) {
      setError(err.message || "Error al eliminar la unidad");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
        <h2 className="unit-detail__title">Modificar unidad</h2>
        <div className="unit-detail__wrapper">
          <PhotoCarousel
            fotos={fotos}
            onUploadSuccess={handleNewPhoto}
            onDeletePhoto={handleDeletePhoto}
          />

          <div className="unit-detail__inputs">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Título"
              className="unit-input"
              required
            />
            {validationErrors.title && (
              <div className="error-message">{validationErrors.title}</div>
            )}
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Descripción"
              className="unit-input"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Dirección"
              className="unit-input"
              required
            />
            {validationErrors.address && (
              <div className="error-message">{validationErrors.address}</div>
            )}
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Precio"
              className="unit-input"
              required
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
                    onFocus={handleFocus}
                    className="numeric-select"
                    required>
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
          <Button1 title="Modificar" onClick={handleModifyUnit} />
          <Button1 title="Eliminar" className="danger" onClick={() => setShowDeleteConfirm(true)} />
        </div>

        {modal && (
          <ConfirmModal
            text={
              modal === "edit" ? "¿Desea confirmar los cambios?" : "¿Desea eliminar esta unidad?"
            }
            error={error}
            onConfirm={confirmAction}
            onCancel={() => setModal(null)}
            loading={loadingConfirm}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmModal
            text="¿Está seguro que desea eliminar esta unidad?"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            loading={isDeleting}
          />
        )}

        {success && (
          <SuccessModal
            message={
              isDeleting
                ? "La unidad se ha eliminado correctamente"
                : "Los cambios se han guardado correctamente"
            }
            onConfirm={() => {
              setSuccess(false);
              if (isDeleting) {
                navigate("/units");
              }
            }}
          />
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}
