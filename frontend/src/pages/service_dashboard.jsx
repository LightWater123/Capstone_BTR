import { useNavigate } from "react-router-dom";
import "../index.css";
import LogoutButton from "../components/modals/LogoutButton";

export default function ServiceDashboard() {
  const navigate = useNavigate();

  const viewMessages = () => {
    navigate("/service/messages");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Service Dashboard</h1>
      <LogoutButton className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition" />
      <div className="space-y-4">
        <button
          onClick={viewMessages}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full max-w-sm"
        >
          Messages
        </button>
      </div>
    </div>
  );
}
