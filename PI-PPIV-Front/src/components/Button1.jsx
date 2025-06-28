import "../styles/Button1.css";

function Button1({ title, type = "button", onClick, className = "" }) {
  return (
    <button type={type} onClick={onClick} className={`button1 ${className}`}>
      {title}
    </button>
  );
}

export default Button1;
