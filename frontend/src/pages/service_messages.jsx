import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';

export default function ServiceMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch authenticated user once
  useEffect(() => {
    axios.get('/api/user')
      .then(res => setUser(res.data))
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // Fetch messages and set up auto-refresh
  useEffect(() => {
    if (!user?.email) return;

    const fetchMessages = () => {
      axios.get('/maintenance/schedule', {
        withCredentials: true
      })
        .then(res => {
          setMessages(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch messages:', err);
          setLoading(false);
        });
    };

    fetchMessages(); // initial fetch

    const interval = setInterval(fetchMessages, 30000); // refresh every 30s

    return () => clearInterval(interval); // cleanup on unmount
  }, [user]);

  const serviceEmail = user?.email || 'maintenance@company.com';

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Received Messages</h2>

      <button
        onClick={() => navigate('/service/dashboard')}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Back to Dashboard
      </button>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found for {serviceEmail}</p>
      ) : (
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Equipment</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="border-t">
                <td className="px-4 py-2">{msg.equipment_id}</td>
                <td className="px-4 py-2">{new Date(msg.scheduled_date).toLocaleString()}</td>
                <td className="px-4 py-2">{msg.contact_name} ({msg.contact_email})</td>
                <td className="px-4 py-2">{msg.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
