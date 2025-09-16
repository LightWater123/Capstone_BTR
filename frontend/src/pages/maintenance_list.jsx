import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function MaintenanceList() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null); // which row is expanded

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data } = await api.get('/api/maintenance/schedule');
      setSchedules(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch maintenance schedules. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString();

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Monitor</h1>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Inventory
          </button>
        </div>

        {loading && <p className="text-gray-600">Loading schedules…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && schedules.length === 0 && (
          <p className="text-gray-600">No maintenance schedules yet.</p>
        )}

        {/* Accordion list */}
        {!loading && schedules.length > 0 && (
          <div className="bg-white rounded shadow divide-y divide-gray-200">
            {schedules.map((s) => (
              <div key={s._id} className="cursor-pointer">
                {/* Visible bar – click to expand */}
                <div
                  onClick={() => toggle(s._id)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{s.assetName}</span>
                  <span className="text-xs text-gray-500">
                    {openId === s._id ? '▲' : '▼'}
                  </span>
                </div>

                {/* Expandable details */}
                {openId === s._id && (
                  <div className="px-4 pb-4 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-500">Asset:</span>
                      <p className="font-medium">{s.assetName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Recipient:</span>
                      <p className="font-medium">{s.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <p className="font-medium">{formatDate(s.scheduledAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${
                            s.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {s.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sender e-mail:</span>
                      <p className="font-mono text-gray-600">{s.userEmail ? 'Sent' : '-'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}