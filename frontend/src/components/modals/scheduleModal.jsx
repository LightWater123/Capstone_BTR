import { useState, useEffect, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import api from '../../api/api';

export default function ScheduleModal({ asset, onClose, onScheduled }) {
  const [form, setForm] = useState({
    recipientEmail: '',
    recipientName: '',
    scheduledAt: new Date(),
    message: ''
  });
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------
   * 1.  Keep form.recipientEmail / Name in sync but
   *     do NOT store the dynamic message in state.
   * ------------------------------------------------- */
  useEffect(() => {
    if (!asset) return;
    setForm(prev => ({
      ...prev,
      recipientEmail: '',
      recipientName: '',
      scheduledAt: new Date()
    }));
  }, [asset]);

  // change the message if scheduledAT is changed or asset changes
  const dynamicMessage = useMemo(() => {
    if (!asset) return '';
    const d = form.scheduledAt;
    return (
      `Hi, your ${asset.description} is due for maintenance ` +
      `on ${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}. Reply YES to confirm or call (xxx) xxx-xxxx.`
    );
  }, [asset, form.scheduledAt]);

  if (!asset) return null;

  const handleSchedule = async () => {
    if (!form.recipientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid e-mail address.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        assetId: asset.id,
        assetName: asset.description,
        recipientEmail: form.recipientEmail,
        recipientName: form.recipientName || form.recipientEmail.split('@')[0],
        scheduledAt: form.scheduledAt,
        message: dynamicMessage
      };
      await api.post('/api/maintenance/schedule', payload);
      await api.post('/api/send-email', {
        recipientEmail: form.recipientEmail,
        recipientName: form.recipientName,
        scheduledAt: form.scheduledAt.toISOString(),
        message: dynamicMessage
      });
      onScheduled();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Scheduling / notification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Schedule maintenance for {asset.description}</h2>

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

        <label>Message (preview)</label>
        <textarea
          className="w-full border rounded p-2"
          rows="4"
          value={dynamicMessage}
          readOnly /* let the user see it update live */
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