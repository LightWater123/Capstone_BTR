// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function LogoutButton({ className = "" }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // Laravel kills the session
    } catch (err) {
      console.error("Logout error:", err);
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
