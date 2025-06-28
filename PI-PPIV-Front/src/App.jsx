// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import RecoveryPass from "./pages/RecoveryPass";
import AdminPanel from "./pages/AdminPanel";
import Admins from "./pages/Admins";
import AdminForm from "./pages/AdminForm";
import Units from "./pages/Units";
import UnitDetail from "./pages/UnitDetail";
import AddUnit from "./pages/AddUnit";
import CheckIn from "./pages/CheckIn";
import Reservations from "./pages/Reservations";
import PriceMultiplier from "./pages/PriceMultiplier";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";
import Survey from "./pages/Survey";
import Footer from "./components/Footer";
import "./styles/main.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/recoveryPass" element={<RecoveryPass />} />
              <Route path="/checkin/:id" element={<CheckIn />} />
              <Route path="/encuesta/:id" element={<Survey />} />

              <Route
                path="/admin-panel"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admins"
                element={
                  <ProtectedRoute>
                    <Admins />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admins/add"
                element={
                  <ProtectedRoute>
                    <AdminForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admins/edit/:username"
                element={
                  <ProtectedRoute>
                    <AdminForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/units"
                element={
                  <ProtectedRoute>
                    <Units />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/units/:id"
                element={
                  <ProtectedRoute>
                    <UnitDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/units/add"
                element={
                  <ProtectedRoute>
                    <AddUnit />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reservations"
                element={
                  <ProtectedRoute>
                    <Reservations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/price-multiplier"
                element={
                  <ProtectedRoute>
                    <PriceMultiplier />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* Ruta por defecto para cualquier URL no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
