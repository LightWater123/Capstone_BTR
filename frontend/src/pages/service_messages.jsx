// components/ServiceMessages.jsx
import { useNavigate } from 'react-router-dom';
import useMaintenanceMessages from '../hooks/useMaintenanceMessages';
import { statusColor, statusLabel } from '../utils/maintenanceHelpers';

export default function ServiceMessages() {
  const navigate = useNavigate();
  const { messages, loading, updateStatus } = useMaintenanceMessages(); // custom hook

  if (loading) return <p>Loading messages…</p>;
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Maintenance Schedule</h2>

      <button
        onClick={() => navigate('/service/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Back to Dashboard
      </button>

      {messages.length === 0 ? (
        <p>No maintenance scheduled for you.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Equipment</th>
              <th className="px-4 py-2 text-left">Scheduled At</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-t">
                <td className="px-4 py-2">{msg.job.asset_name}</td>
                <td className="px-4 py-2">
                  {new Date(msg.job.scheduled_at).toLocaleString()}
                </td>

                {/* status changer */}
                <td className="px-4 py-2">
                  <select
                    className={`border rounded px-2 py-1 ${statusColor(msg.job.status)}`}
                    value={msg.job.status}
                    onChange={(e) => {
                      //console.log('msg.job._id in onChange:', msg.job._id);
                      updateStatus(msg.job.id, e.target.value)}}
                  >
                    {['pending','in-progress','done'].map(s => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-2">{msg.body_html}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}