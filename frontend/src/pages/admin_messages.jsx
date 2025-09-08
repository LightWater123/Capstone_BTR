import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import ViewMessageModal from "../components/modals/viewMessageModal.jsx";

export default function AdminMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const handleBack = () => navigate("/inventory");


    useEffect(() => {
        const fetchMessages = async () => {
        try {
            const { data } = await api.get("/maintenance-messages");
            setMessages(data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchMessages();
    }, []);

    const openModal = (msg) => setSelectedMessage(msg);
    const closeModal = () => setSelectedMessage(null);

    if (loading) return <p className="text-gray-500">Loading messages...</p>;

    return (
        <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-black">Sent Maintenance Messages</h2>
        <button
          onClick={handleBack}
          className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          Back to Dashboard
        </button>
        {messages.length === 0 ? (
            <p className="text-gray-600">No messages found.</p>
        ) : (
            <ul className="space-y-2">
            {messages.map((msg) => (
                <li
                key={msg._id || msg.id}
                onClick={() => openModal(msg)}
                className="flex justify-between items-center p-4 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                >
                <div>
                    <p className="font-semibold text-black">{msg.recipient_name}</p>
                    <p className="text-sm text-gray-700 truncate w-64">{msg.message}</p>
                </div>
                <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</p>
                </li>
            ))}
            </ul>
        )}

        {selectedMessage && (
            <ViewMessageModal
            isOpen={true}
            message={selectedMessage}
            onClose={closeModal}
            />
        )}
        </div>
    );
    }
