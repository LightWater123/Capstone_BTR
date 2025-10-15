    import React, { useState } from 'react';
    import axios from 'axios';
    import api from '../../api/api';

    export default function ChangePasswordModal({ onClose }) {
    const [form, setForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const save = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        try {
        await api.post('/api/admin/change-password', form, { withCredentials: true });
        setMsg({ text: 'Password updated successfully', type: 'success' });
        setForm({ current_password: '', new_password: '', new_password_confirmation: '' });
        setTimeout(() => onClose(), 1500); // auto-close after success
        } catch (err) {
        setMsg({ text: err.response?.data?.message || 'Update failed', type: 'error' });
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            {msg.text && (
            <div
                className={`mb-3 text-sm border rounded px-3 py-2 ${
                msg.type === 'success'
                    ? 'text-green-700 bg-green-100 border-green-400'
                    : 'text-red-700 bg-red-100 border-red-400'
                }`}
            >
                {msg.text}
            </div>
            )}

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

            <div className="flex justify-end gap-2">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 disabled:opacity-60"
                >
                {loading ? 'Saving…' : 'Save'}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    }