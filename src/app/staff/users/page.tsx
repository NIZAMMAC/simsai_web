'use client';

import { useState, useTransition, useEffect } from 'react';
import { createStaffUser, deleteStaffUser, getStaffUsers } from '@/app/actions/staff-management';

export default function StaffManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    const loadUsers = async () => {
        const data = await getStaffUsers();
        if (data.length === 0) {
            // Either no users (unlikely) or UNAUTHORIZED (because we return empty array for non-master)
            // Ideally we should handle this better, but for now this works as a simple gate.
        }
        setUsers(data);
    };

    const handleCreate = (formData: FormData) => {
        startTransition(async () => {
            const result = await createStaffUser(formData);
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage('Staff user added successfully!');
                setShowForm(false);
                loadUsers();
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    const handleDelete = (userId: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;

        startTransition(async () => {
            const result = await deleteStaffUser(userId);
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage('Staff user removed');
                loadUsers();
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Manage Staff</h1>
                    <p style={{ color: '#666' }}>Add or remove administrators</p>
                </div>
                <a href="/staff" className="btn btn-outline">← Back to Dashboard</a>
            </header>

            {message && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: message.includes('success') || message.includes('removed') ? '#d1fae5' : '#fee2e2',
                    color: message.includes('success') || message.includes('removed') ? '#059669' : '#dc2626'
                }}>
                    {message}
                </div>
            )}

            <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
                style={{ marginBottom: '1.5rem', width: '100%' }}
            >
                {showForm ? 'Cancel' : '➕ Add New Staff Member'}
            </button>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb' }}>
                    <form action={handleCreate}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                            <input name="name" type="text" required className="input" placeholder="e.g. John Doe" />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                            <input name="email" type="email" required className="input" placeholder="e.g. john@simsai.com" />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                            <input name="password" type="password" required className="input" placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ width: '100%' }}>
                            {isPending ? 'Saving...' : 'Create Admin Account'}
                        </button>
                    </form>
                </div>
            )}

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Created</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem', fontWeight: 500 }}>{user.name}</td>
                                <td style={{ padding: '0.75rem', color: '#666' }}>{user.email}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#888' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={isPending}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
