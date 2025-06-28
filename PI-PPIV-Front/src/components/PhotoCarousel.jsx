//components/PhotoCarousel.jsx

import { useState, useEffect } from "react";
import placeholder from "../assets/casita.jpg";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import "../styles/PhotoCarousel.css";
import Button1 from "./Button1";
import SuccessModal from "./SuccessModal";

export default function PhotoCarousel({ fotos = [], onUploadSuccess, onDeletePhoto }) {
  const [images, setImages] = useState(fotos.length ? fotos : [placeholder]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setImages(fotos.length ? fotos : [placeholder]);
  }, [fotos]);

  const prevImage = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setMessage("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      setMessage("La imagen no debe superar los 5MB");
      return;
    }

    setUploading(true);
    setMessage("");
    setShowSuccessModal(false);

    try {
      const url = await uploadToCloudinary(file);
      const newImages = images[0] === placeholder ? [url] : [...images, url];
      setImages(newImages);
      setCurrentIndex(newImages.length - 1);
      setMessage("Foto subida correctamente");
      setShowSuccessModal(true);
      if (onUploadSuccess) onUploadSuccess(url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setMessage(err.message || "Error al subir la foto");
      setShowSuccessModal(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = () => {
    // Si solo queda el placeholder, no permitir eliminar
    if (images.length === 1 && images[0] === placeholder) {
      setMessage("No se puede eliminar la imagen por defecto");
      return;
    }

    const photoToDelete = images[currentIndex];
    const newImages = images.filter((_, index) => index !== currentIndex);

    // Si después de eliminar no quedan fotos, agregar el placeholder
    const finalImages = newImages.length === 0 ? [placeholder] : newImages;
    setImages(finalImages);
    setCurrentIndex(0); // Siempre mostrar la primera imagen después de eliminar

    if (onDeletePhoto) {
      onDeletePhoto(photoToDelete);
    }
    setMessage("Foto eliminada correctamente");
    setShowSuccessModal(true);
  };

  return (
    <div className="carousel">
      <div className="carousel-image-wrapper">
        <img className="carousel-img" src={images[currentIndex]} alt={`Foto ${currentIndex + 1}`} />
      </div>

      <div className="carousel-controls">
        <button onClick={prevImage} disabled={uploading}>
          &lt;
        </button>
        <button onClick={nextImage} disabled={uploading}>
          &gt;
        </button>
      </div>

      <div className="carousel-actions">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            id="file-upload"
            hidden
          />
          <Button1
            title={uploading ? "Subiendo..." : "Subir foto"}
            disabled={uploading}
            onClick={() => document.getElementById("file-upload").click()}
          />
        </div>
        {images.length > 1 || (images.length === 1 && images[0] !== placeholder) ? (
          <Button1
            title="Eliminar foto"
            onClick={handleDeletePhoto}
            disabled={uploading}
            className="danger"
          />
        ) : null}
      </div>

      {message && !showSuccessModal && (
        <p className={`upload-message ${uploading ? "uploading" : ""}`}>{message}</p>
      )}

      {showSuccessModal && (
        <SuccessModal
          message={message}
          onClose={() => {
            setShowSuccessModal(false);
            setMessage("");
          }}
        />
      )}
    </div>
  );
}
