import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/PriceMultiplier.css";

function MultiplierRow({
  rate,
  index,
  onDateRangeChange,
  onMultiplierChange,
  onRemove,
  isDateAvailable
}) {
  return (
    <div className="price-multiplier__rate-row">
      <div className="price-multiplier__date-group">
        <DatePicker
          selected={rate.since}
          onChange={dates => onDateRangeChange(index, dates)}
          startDate={rate.since}
          endDate={rate.until}
          selectsRange
          minDate={new Date()}
          placeholderText="Seleccione el rango de fechas"
          className="price-multiplier__date-input"
          dateFormat="dd/MM/yyyy"
          isClearable
          filterDate={date => {
            if (!date) return true;
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            return isDateAvailable(checkDate, index);
          }}
        />
      </div>
      <div className="price-multiplier__date-group">
        <input
          type="number"
          value={rate.multiplier}
          onChange={e => onMultiplierChange(index, e.target.value)}
          min="0.1"
          step="0.1"
          className="price-multiplier__multiplier-input"
          placeholder="Multiplicador"
        />
      </div>
      <div className="price-multiplier__row-actions">
        <button className="price-multiplier__remove-button" onClick={() => onRemove(index)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default MultiplierRow;
