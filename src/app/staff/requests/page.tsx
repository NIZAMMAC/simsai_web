'use client';

import { useState, useTransition, useEffect } from 'react';
import { getResetRequests, approvePasswordReset } from '@/app/actions/staff-management';

export default function PasswordRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        const data = await getResetRequests();
        setRequests(data);
    };

    const handleApprove = (userId: string) => {
        if (!confirm('This will reset the user password to "1234". Continue?')) return;

        startTransition(async () => {
            const result = await approvePasswordReset(userId);
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage('Password reset to 1234');
                loadRequests();
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Password Reset Requests</h1>
                    <p style={{ color: '#666' }}>Approve requests to reset student passwords to default (1234)</p>
                </div>
                <a href="/staff" className="btn btn-outline">← Back to Dashboard</a>
            </header>

            {message && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: message.includes('reset') ? '#d1fae5' : '#fee2e2',
                    color: message.includes('reset') ? '#059669' : '#dc2626'
                }}>
                    {message}
                </div>
            )}

            <div className="card">
                {requests.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        No pending password reset requests.
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem' }}>Name</th>
                                <th style={{ padding: '0.75rem' }}>Email</th>
                                <th style={{ padding: '0.75rem' }}>Requested At</th>
                                <th style={{ padding: '0.75rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{req.name}</td>
                                    <td style={{ padding: '0.75rem', color: '#666' }}>{req.email}</td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#888' }}>
                                        {new Date(req.resetRequestedAt).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            disabled={isPending}
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                        >
                                            Reset to 1234
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
