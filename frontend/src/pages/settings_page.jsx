import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ChangePasswordModal from '../components/modals/changePasswordModal';
import BTRheader from "../components/modals/btrHeader";
import BTRNavbar from "../components/modals/btrNavbar.jsx";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BTRheader />
      <BTRNavbar />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Security card */}
      <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <h2 className="text-lg font-semibold">Security</h2>

        {/* Change Password button opens modal */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Change Password
        </button>

        {/* Forgot-password link (outside modal) */}
        <Link
          to="/forgot-password"
          className="ml-3 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Reset via Email
        </Link>
      </div>

      {/* Render modal */}
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  );
}