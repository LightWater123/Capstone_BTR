import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await axios.post(
        '/api/admin/change-password', // ← or /api/change-password
        form,
        { withCredentials: true } // send session cookie
      );
      setMsg({ text: 'Password updated successfully', type: 'success' });
      setForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || 'Update failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Account section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Security</h2>

        {/* feedback */}
        {msg.text && (
          <div
            className={`mb-4 text-sm border rounded px-3 py-2 ${
              msg.type === 'success'
                ? 'text-green-700 bg-green-100 border-green-400'
                : 'text-red-700 bg-red-100 border-red-400'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* form */}
        <form onSubmit={save} className="space-y-4">
          <input
            name="current_password"
            type="password"
            required
            placeholder="Current password"
            value={form.current_password}
            onChange={handle}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="new_password"
            type="password"
            required
            placeholder="New password"
            value={form.new_password}
            onChange={handle}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="new_password_confirmation"
            type="password"
            required
            placeholder="Confirm new password"
            value={form.new_password_confirmation}
            onChange={handle}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}