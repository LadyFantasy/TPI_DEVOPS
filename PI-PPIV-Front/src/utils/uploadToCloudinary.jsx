export async function uploadToCloudinary(file) {
  const cloudName = "damlscz2d";
  const uploadPreset = "omeguitas";

  // Validar que el archivo sea una imagen
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || `Error al subir la imagen: ${res.status}`);
    }

    if (!data.secure_url) {
      throw new Error("No se recibió la URL de la imagen");
    }

    return data.secure_url;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error("Error al conectar con Cloudinary");
  }
}
