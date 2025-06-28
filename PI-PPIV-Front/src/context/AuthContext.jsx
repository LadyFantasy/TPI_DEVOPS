// /context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return !!(token && username);
  });
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    const isSuperAdmin = localStorage.getItem("isSuperAdmin");
    return username ? { username, isSuperAdmin: isSuperAdmin === "1" } : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const isSuperAdmin = localStorage.getItem("isSuperAdmin");

      if (token && username) {
        setIsAuthenticated(true);
        setUser({
          username,
          isSuperAdmin: isSuperAdmin === "1"
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (username, token, isSuperAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("isSuperAdmin", isSuperAdmin);
    setIsAuthenticated(true);
    setUser({
      username,
      isSuperAdmin: isSuperAdmin === "1"
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isSuperAdmin");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
