import { useNavigate } from "react-router-dom";
import "../index.css";

export default function DirectorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Director Dashboard</h1>

      <div className="space-y-4">
        {/* Future buttons or actions can go here */}
        {/* Example:
        <button
          onClick={() => navigate("/oic/approvals")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full max-w-sm"
        >
          View Pending Approvals
        </button>
        */}
      </div>
    </div>
  );
}
