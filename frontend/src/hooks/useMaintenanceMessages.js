// hooks/useMaintenanceMessages.js
import { useEffect, useState } from 'react';
import api from '../api/api';

export default function useMaintenanceMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(''); // progress note

  const fetchData = async () => {
    
    try {
      const { data } = await api.get('/api/my-messages', { withCredentials: true });
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (jobId, status) => {

    //console.log('updateStatus called with jobId:', jobId);
    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(jobId)) {
     console.warn('Invalid job id - not calling API', jobId);
     return;
   }
    
    await api.patch(`/api/maintenance-jobs/${jobId}/status`, { status }, { withCredentials: true });
    fetchData();
  };

  const saveProgressNote = async (jobId, text) => {
    if (!text.trim()) return;
    await api.post(`/api/maintenance-jobs/${jobId}/log`, { text }, { withCredentials: true });
    setNote('');
    fetchData();
  };

  return { messages, loading, updateStatus, saveProgressNote, note, setNote };
}