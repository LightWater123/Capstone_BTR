import Bell from '../../assets/notification.png';
import profileuser from '../../assets/profile-user.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const [isDropOpen, setIsDropOpen] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => navigate("/service/dashboard");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
      <nav className="w-full bg-white shadow-sm rounded-xl mb-4 flex items-center justify-between px-5 py-3 text-sm">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
        onClick={handleBack}
        className="text-sm bg-white  px-3 py-1 rounded"
      >
          <span className="grid h-10 w-10 place-items-center rounded-lg text-gray-500 font-bold text-lg">
            Dashboard
          </span>
      </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <a href="#" className="text-gray-600 hover:text-blue-700">
            <img src={Bell} alt="Notifications" className="h-5 w-5" />
          </a>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropOpen(v => !v)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700"
            >
              <img
                src={profileuser}
                alt="User"
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="hidden sm:inline text-lg p-2">Username</span>
              <svg
                className={`h-4 w-4 transition ${
                  isDropOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {isDropOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border bg-white shadow-lg py-1 z-50">
                
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </a>

                
                <LogoutButton className="block w-full text-left px-4 py-2 hover:bg-gray-100" />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}