export default function ViewMessageModal({ isOpen, message, onClose }) {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">Message Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <p className="text-sm text-gray-800"><strong>To:</strong> {message.recipient_name}</p>
        <p className="text-sm text-gray-800"><strong>Sent:</strong> {new Date(message.created_at).toLocaleString()}</p>
        <hr className="my-3" />
        <p className="text-gray-900 whitespace-pre-line">{message.message}</p>
      </div>
    </div>
  );
}
