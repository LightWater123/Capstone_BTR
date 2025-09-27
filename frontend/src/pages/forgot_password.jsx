import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/forgot-password', { email }, { withCredentials: true });
      setSent(true); setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
      {sent && <p className="text-green-600 mb-4">We have e-mailed your password reset link!</p>}
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
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send Link</button>
      </form>
    </div>
  );
}