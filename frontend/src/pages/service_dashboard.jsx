import { useNavigate } from "react-router-dom";
import "../index.css";
import BTRheader from "../components/modals/btrHeader";
import Navbar from "../components/modals/serviceNavbar.jsx";
import Calendar from "../components/modals/serviceCalendar.jsx";
import { Wrench } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleCreateServiceAccount = () => navigate("/register/service");
  const handleInventoryList = () => navigate("/service/inventory");

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BTRheader />
      <Navbar />
    

      <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Preventive Maintenance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Preventive Maintenance  */}
                <div className="lg:col-span-2">
                  <button
                    onClick={handleInventoryList}
                    className="w-full h-[350px] bg-white rounded-xl text-gray-800 hover:bg-[#FCFC62] font-medium shadow-md text-3xl flex items-center justify-center transition-colors"
                  >
                    <Wrench className="h-10 w-10 inline-block mr-2 relative m-4"/>
                     Assets to be maintained
                  </button>
                </div>
      
                {/* Calendar */}
                <div className="lg:col-span-1 justify-center flex">
                  <Calendar />
                </div>
              </div>
      
              {/* Reminders */}
              <div className="w-full min-w-[300px] h-[350px] bg-gray-100 rounded-xl shadow-md p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Reminders</h2>
                <ul className="flex-1 overflow-y-auto space-y-2">
                  <li className="bg-white p-2 rounded shadow-sm">Maintenance</li>
                  <li className="bg-white p-2 rounded shadow-sm">Maintenance</li>
                </ul>
              </div>
            </div>
    </div>
  );
}
