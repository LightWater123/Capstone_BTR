import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [token, setToken]           = useState('');
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => setToken(searchParams.get('token') || ''), [searchParams]);

  // calls the api to reset the changed password
  const submit = async e => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    try {
      await axios.post('/api/reset-password', {
        email, token, password, password_confirmation: confirm
      }, { withCredentials: true });
      setDone(true); setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Set New Password</h2>
      {done && <p className="text-green-600 mb-4">Password changed! Redirecting…</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          required
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Reset Password</button>
      </form>
    </div>
  );
}