// src/constants/amenities.js

export const ALL_AMENITIES = [
  "aire acondicionado",
  "ventilador",
  "wifi",
  "hidromasaje/jacuzzi",
  "parking",
  "parrilla",
  "piscina",
  "admite mascotas",
  "balcon",
  "lavarropa",
  "cocina",
  "gimnasio",
  "incluye desayuno",
  "detector de humo",
  "blanqueria",
  "servicio de habitaciones"
];

// Mapeo entre la versión mostrada y la versión guardada
export const AMENITIES_MAP = {
  balcón: "balcon"
};

// Función para convertir la versión guardada a la versión mostrada
export const getDisplayVersion = amenity => {
  if (amenity === "balcon") return "balcón";
  return amenity;
};
