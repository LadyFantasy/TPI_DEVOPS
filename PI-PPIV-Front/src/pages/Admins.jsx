import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import { FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import Button1 from "../components/Button1";
import "../styles/Admins.css";

function Admins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState({});
  const [editedAdmins, setEditedAdmins] = useState({});
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSuperAdmin = () => {
      const superAdmin = localStorage.getItem("isSuperAdmin") === "1";
      if (!superAdmin) {
        navigate("/admin");
        return false;
      }
      return true;
    };

    if (checkSuperAdmin()) {
      loadAdmins();
    }
  }, [navigate]);

  const handleDeleteClick = (id, username) => {
    setAdminToDelete({ id, username });
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;
    setDeletingAdmin(true);
    try {
      const response = await fetchWithToken(`/deleteAdmin/${adminToDelete.id}`, {
        method: "DELETE"
      });

      if (response.message) {
        setSuccessMessage(response.message);
        setShowSuccessModal(true);
        setShowModal(false);
        loadAdmins();
      }
    } catch {
      setError("Error al eliminar el administrador");
      setShowModal(false);
    } finally {
      setAdminToDelete(null);
      setDeletingAdmin(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setAdminToDelete(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetchWithToken("/verAdmins");
      setAdmins(response);
      setEditedAdmins({});
    } catch {
      setError("Error al cargar los administradores");
    } finally {
      setLoading(false);
    }
  };

  const handleSuperUserChange = (username, checked) => {
    setAdmins(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        superUser: checked
      }
    }));
    setEditedAdmins(prev => ({
      ...prev,
      [username]: {
        ...admins[username],
        superUser: checked
      }
    }));
  };

  const handleSaveChanges = async () => {
    setError("");
    if (Object.keys(editedAdmins).length === 0) return;
    try {
      const payload = Object.values(editedAdmins).map(admin => ({
        [admin.id]: admin.superUser ? 1 : 0
      }));
      await fetchWithToken("/editAdmin", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setSuccessMessage("Cambios guardados correctamente");
      setShowSuccessModal(true);
      loadAdmins();
    } catch {
      setError("Error al guardar los cambios");
    }
  };

  return (
    <>
      <Navbar />
      <div className="admins-container">
        <div className="admins-list">
          <div className="admins-list__header">
            <h2>Administradores existentes</h2>
          </div>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p className="loading">Cargando administradores...</p>
          ) : (
            <div className="admins-list__content" onClick={() => setError("")}>
              <div className="admin-table">
                <div className="admin-table-header">
                  <div className="admin-table-cell">ID</div>
                  <div className="admin-table-cell">Usuario</div>
                  <div className="admin-table-cell">Super Usuario</div>
                  <div className="admin-table-cell">Acciones</div>
                </div>

                {Object.entries(admins).map(([username, data]) => (
                  <div key={data.id} className="admin-table-row">
                    <div className="admin-table-cell">{data.id}</div>
                    <div className="admin-table-cell">{username}</div>
                    <div className="admin-table-cell">
                      <input
                        type="checkbox"
                        checked={!!data.superUser}
                        onChange={e => handleSuperUserChange(username, e.target.checked)}
                        className="admin-superuser-checkbox"
                      />
                    </div>
                    <div className="admin-table-cell actions">
                      <button
                        className="action-button delete"
                        onClick={() => handleDeleteClick(data.id, username)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                  justifyContent: "flex-end"
                }}>
                <Button1 title="Agregar administrador" onClick={() => navigate("/admins/add")} />
                <Button1 title="Guardar cambios" onClick={handleSaveChanges} />
              </div>
            </div>
          )}
        </div>

        {showModal && adminToDelete && (
          <ConfirmModal
            text={`¿Estás seguro de que deseas eliminar al administrador ${adminToDelete.username}?`}
            onConfirm={handleDeleteConfirm}
            onCancel={handleCancel}
            loading={deletingAdmin}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            show={showSuccessModal}
            onConfirm={handleSuccessClose}
            message={successMessage}
          />
        )}
      </div>
    </>
  );
}

export default Admins;
