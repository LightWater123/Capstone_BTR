import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ChangePasswordModal from '../components/modals/changePasswordModal';
import BTRheader from "../components/modals/btrHeader";
import BTRNavbar from "../components/modals/btrNavbar.jsx";
import { ChevronLeftCircle } from "lucide-react"
import { Mail } from 'lucide-react';
import { Lock } from 'lucide-react';

export default function SettingsPage() { 
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BTRheader />
      <BTRNavbar />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        

        <div className="flex items-center gap-4 justify-end">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
        >
          <ChevronLeftCircle className="h-5 w-5 inline-block mr-2" />
          Back to Dashboard
        </button>
      </div>
      <h2 className="text-lg font-bold m-2 gap-3">Account Settings</h2>
      </div>

      {/* Security card */}
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <h2 className="text-lg rounded font-semibold m-2">Security</h2>

        {/* Change Password button opens modal */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
        >
          <Lock className="h-5 w-5 inline-block mr-2" />
          Change Password
        </button>

        <button
          to="/forgot-password"
          className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 ml-4"
        >
          <Mail className="h-5 w-5 inline-block mr-2" />
          Reset via Email
        </button>
      </div>

      {/* Render modal */}
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  );
}