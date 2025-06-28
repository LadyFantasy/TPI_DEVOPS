import "../styles/AdminCard.css";

function AdminCard({ title, onClick, className = "" }) {
  return (
    <div className={`admincard ${className}`} onClick={onClick}>
      <h1 className="admincard__title">{title}</h1>
    </div>
  );
}

export default AdminCard;
