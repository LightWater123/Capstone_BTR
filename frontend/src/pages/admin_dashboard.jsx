import { useNavigate } from "react-router-dom";
import "../index.css";
import BTRheader from "../components/modals/btrHeader";
import BTRNavbar from "../components/modals/btrNavbar.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleCreateServiceAccount = () => navigate("/register/service");
  const handleInventoryList = () => navigate("/inventory");

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* 1.  Government banner */}
      <BTRheader />
      <BTRNavbar />
      <div className="flex flex-wrap gap-6 justify-center max-w-6xl mx-auto">
          {/* Preventive Maintenance */}
          <button
            onClick={handleInventoryList}
            className="w-[1000px] md:w-[67%] h-[400px] bg-gray-100 rounded-xl text-gray-800 hover:bg-[#FCFC62] font-medium shadow-md text-3xl flex items-center justify-center space-x-4 transition-colors p-4 min-w-[200px]">
            Preventive Maintenance
          </button>
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
