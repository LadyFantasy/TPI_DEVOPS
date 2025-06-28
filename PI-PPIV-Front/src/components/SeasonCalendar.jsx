import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/PriceMultiplier.css";

function SeasonCalendar({ rates }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getMultiplierColor = multiplier => {
    if (multiplier > 2) return "#ff4444";
    if (multiplier >= 1) {
      const ratio = Math.min((multiplier - 1) / 1, 1);
      const r = 102 + (52 - 102) * ratio;
      const g = 187 + (152 - 187) * ratio;
      const b = 106 + (219 - 106) * ratio;
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
    const ratio = multiplier;
    return `rgb(${144 + (102 - 144) * ratio}, ${238 + (187 - 238) * ratio}, ${
      144 + (106 - 144) * ratio
    })`;
  };

  const renderDayContents = (day, date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const rate = rates.find(rate => {
      if (!rate.since || !rate.until) return false;
      const start = new Date(rate.since);
      const end = new Date(rate.until);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return normalizedDate >= start && normalizedDate <= end;
    });

    const color = rate ? getMultiplierColor(rate.multiplier) : null;
    const title = rate ? `Multiplicador: ${rate.multiplier}x` : "Multiplicador: 1x (Base)";

    return (
      <div
        className={`price-multiplier__day-content ${color ? "has-color" : ""}`}
        title={title}
        style={color ? { backgroundColor: color } : {}}>
        {day}
      </div>
    );
  };

  return (
    <div className="price-multiplier__calendar-container">
      <h2>Calendario de Temporadas</h2>
      <div className="price-multiplier__calendar">
        <div className="price-multiplier__calendar-grid">
          <div className="price-multiplier__calendar-month">
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              inline
              renderDayContents={renderDayContents}
              readOnly
            />
          </div>
        </div>
        <div className="price-multiplier__legend">
          <div className="price-multiplier__legend-item">
            <div className="price-multiplier__legend-color price-multiplier__legend-color--green" />
            <span>Multiplicador 0x - 1x</span>
          </div>
          <div className="price-multiplier__legend-item">
            <div className="price-multiplier__legend-color price-multiplier__legend-color--blue" />
            <span>Multiplicador 1x - 2x</span>
          </div>
          <div className="price-multiplier__legend-item">
            <div className="price-multiplier__legend-color price-multiplier__legend-color--red" />
            <span>Multiplicador 2x o más</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonCalendar;
