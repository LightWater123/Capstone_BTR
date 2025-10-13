import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import BTRheader from "../components/modals/btrHeader";
import BTRNavbar from "../components/modals/btrNavbar.jsx";
import wrenchicon from '../assets/wrench.png';
import CalendarModal from "../components/modals/calendar.jsx";
import api from '../api/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const handleInventoryList = () => navigate("/inventory");
  const [open, setOpen] = useState(false);

  // State for data, loading, and errors
  const [dueItems, setDueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchDueItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the api instance. The baseURL is already set.
        // Axios automatically parses JSON and handles credentials.
        const response = await api.get('/api/maintenance/due-for-maintenance?days=2');
        
        // The data is in the `data` property of the response
        setDueItems(response.data);
      } catch (err) {
        // Axios provides a more detailed error object
        const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred';
        setError(errorMessage);
        console.error("Failed to fetch maintenance items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDueItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <BTRheader />
      <BTRNavbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <button
              onClick={handleInventoryList}
              className="w-full h-[350px] bg-white rounded-xl text-gray-800 hover:bg-[#FCFC62] font-medium shadow-md text-3xl flex items-center justify-center transition-colors"
            >
              <img src={wrenchicon} alt="Wrench Icon" className="w-14 h-14 opacity-50 p-3" />
              Preventive Maintenance
            </button>
          </div>

          <div className="lg:col-span-1">
            <CalendarModal />
          </div>
        </div>

        {/* Update the reminders section with conditional rendering */}
        <div className="w-full min-w-[300px] h-[350px] bg-gray-100 rounded-xl shadow-md p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Reminders</h2>
          <ul className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <li className="text-gray-500 text-center py-4">Loading...</li>
            ) : error ? (
              <li className="text-red-500 text-center py-4">Error: {error}</li>
            ) : dueItems.length === 0 ? (
              <li className="text-gray-500">No items are due for maintenance in the next 2 days.</li>
            ) : (
              dueItems.map((item) => (
                <li key={item._id} className="bg-white p-3 rounded shadow-sm border-l-4 border-yellow-500">
                  <div className="font-semibold text-gray-800">{item.article}</div>
                  <div className="text-sm text-gray-700">{item.description}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Due: {new Date(item.end_date).toLocaleDateString()} | Location: {item.location}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}