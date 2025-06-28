import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin-panel", { replace: true });
  }, [navigate]);

  return null;
}

export default NotFound;
