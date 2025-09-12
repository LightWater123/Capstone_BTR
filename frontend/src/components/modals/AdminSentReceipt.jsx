// resources/js/components/modals/AdminSentReceipt.jsx
export default function AdminSentReceipt({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Maintenance Scheduled</h2>

        <div className="text-sm space-y-1">
          <p><strong>Equipment:</strong> {job.assetName}</p>
          <p><strong>Recipient:</strong> {job.userEmail}</p>
          <p><strong>Scheduled:</strong> {new Date(job.scheduledAt).toLocaleString()}</p>
          <p><strong>Gmail sent:</strong> Yes</p>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
          <a
            href={`https://mail.google.com/mail/u/0/#sent`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Open Gmail
          </a>
        </div>
      </div>
    </div>
  );
}