// resources/js/components/ScheduleModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import api from '../../api/api';

export default function ScheduleModal({ asset, onClose, onScheduled }) {
  /* ---------- state ---------- */
  const [form, setForm] = useState({
    recipientEmail: '',
    recipientName: '',
    scheduledAt: new Date(),
    message: ''
  });
  const [loading, setLoading] = useState(false);

  /* ---------- reset form when asset changes ---------- */
  useEffect(() => {
    if (!asset) return;
    setForm({
      recipientEmail: '',
      recipientName: '',
      scheduledAt: new Date(),
      message: `Hi, your ${asset.description} is due for maintenance on ${asset.start_date} at ${asset.end_date}. Reply YES to confirm or call (xxx) xxx-xxxx.`
    });
  }, [asset]);

  /* ---------- guard ---------- */
  if (!asset) return null;

  /* ---------- handler ---------- */
  const handleSchedule = async () => {
    if (!form.recipientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid e-mail address.');
      return;
    }
    setLoading(true);
    const payload = {
      assetId: asset.id,
      assetName: asset.name,
      recipientEmail: form.recipientEmail,
      recipientName: form.recipientName || form.recipientEmail.split('@')[0],
      scheduledAt: form.scheduledAt,
      message: form.message
        .replace('{date}', form.scheduledAt.toLocaleDateString())
        .replace('{time}', form.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    };
    await api.post('/api/maintenance/schedule', payload);
    onScheduled();
    onClose();
  };

  /* ---------- render ---------- */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Schedule maintenance for {asset.name}</h2>

        <label>Service-User E-mail</label>
        <input
          type="email"
          className="w-full border rounded p-2"
          placeholder="user@example.com"
          value={form.recipientEmail}
          onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
        />

        <label>Service-User Name (optional)</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Juan Dela Cruz"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
        />

        <label>Date & Time</label>
        <Flatpickr
          value={form.scheduledAt}
          onChange={([d]) => setForm({ ...form, scheduledAt: d })}
          options={{ enableTime: true, dateFormat: 'Y-m-d H:i' }}
        />

        <label>Message</label>
        <textarea
          className="w-full border rounded p-2"
          rows="4"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>

          <button onClick={handleSchedule} disabled={loading} className="btn btn-primary">
            {loading ? 'Scheduling...' : 'Schedule & Notify'}
          </button>
        </div>
      </div>
    </div>
  );
}