// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../hooks/useAuth";
import { useServiceAuth } from "../../hooks/useServiceAuth";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();
  const { user: regularUser } = useAuth();
  const { user: serviceUser } = useServiceAuth();

  // Determine which user is currently logged in
  const currentUser = regularUser || serviceUser;

  const handleLogout = async () => {
    try {
      // Use the API logout endpoint for all users since the backend now handles guard detection
      await api.post("/api/logout"); // Laravel kills the session
    } catch (err) {
      console.error("Logout error:", err);
      // Even if there's an error, redirect to login page
    } finally {
      navigate("/"); // Always go to login page
    }
  };

  return (
    <button onClick={handleLogout} className={className || "btn btn-danger"}>
      Logout
    </button>
  );
}
