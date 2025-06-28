//components/AmenitiesSelector.jsx

import { useState, useEffect, useRef } from "react";
import "../styles/AmenitiesSelector.css";
import Button1 from "./Button1";
import { AMENITIES_MAP, getDisplayVersion } from "../constants/amenities";

export default function AmenitiesSelector({ all, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAmenity = amenity => {
    const storedVersion = AMENITIES_MAP[amenity] || amenity;
    onChange(
      selected.includes(storedVersion)
        ? selected.filter(a => a !== storedVersion)
        : [...selected, storedVersion]
    );
  };

  const isSelected = amenity => {
    const storedVersion = AMENITIES_MAP[amenity] || amenity;
    return selected.includes(storedVersion);
  };

  return (
    <div className="amenities-selector" ref={selectorRef}>
      <Button1 type="button" onClick={() => setIsOpen(!isOpen)} title="Comodidades" />

      {isOpen && (
        <div className="amenities-options">
          {all.map(a => (
            <label key={a} className="amenity-option">
              <input
                className="amenity-checkbox"
                type="checkbox"
                checked={isSelected(a)}
                onChange={() => toggleAmenity(a)}
              />
              {getDisplayVersion(a)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
