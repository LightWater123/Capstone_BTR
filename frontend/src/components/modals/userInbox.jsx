// resources/js/components/UserInbox.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Echo from 'laravel-echo';

// SERVICE USER INBOX

export default function UserInbox() {
    const [msgs, setMsgs] = useState([]);
    const userId = window.userId; // blade echo

    useEffect(()=>{
        axios.get('/api/my-messages').then(r=>setMsgs(r.data));
        window.Echo.channel(`user.${userId}`)
                   .listen('MaintenanceConfirmed', e => {
                       setMsgs(prev => [{...e, id:e.jobId, created_at:new Date().toISOString()}, ...prev]);
                   });
    },[userId]); 

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">My Messages</h2>
            <div className="space-y-3">
                {msgs.map(m=>(
                    <div key={m.id} className="border rounded p-4">
                        <div className="font-semibold">{m.subject}</div>
                        <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{__html:m.bodyHtml}}/>
                        <div className="text-xs text-gray-400 mt-2">{new Date(m.created_at).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}