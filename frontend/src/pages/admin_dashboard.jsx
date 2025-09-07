import { useNavigate } from "react-router-dom";
import "../index.css";
import LogoutButton from "../components/modals/LogoutButton";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleCreateServiceAccount = () => {
    navigate("/register/service");
  };

  const handleInventoryList = () => {
    navigate("/inventory");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h1>
      <LogoutButton className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition" />

      <div className="space-y-4">
        <button
          onClick={handleCreateServiceAccount}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full max-w-sm"
        >
          Create Service User Account
        </button>

        <button
          onClick={handleInventoryList}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full max-w-sm"
        >
          Preventive Maintenance
        </button>
      </div>
    </div>
  );
}
