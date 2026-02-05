'use client';

import { useState, useTransition } from 'react';
import { changePassword } from '@/app/actions/auth';

export function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (formData: FormData) => {
        setMessage('');
        setError('');

        startTransition(async () => {
            const result = await changePassword(null, formData);
            if (result.error) {
                setError(result.error);
            } else {
                setMessage(result.message || 'Password updated');
                // clear form
                const form = document.getElementById('change-password-form') as HTMLFormElement;
                form.reset();
                setTimeout(() => setIsOpen(false), 2000);
            }
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-outline"
                style={{ fontSize: '0.875rem' }}
            >
                🔒 Change Password
            </button>
        );
    }

    return (
        <div className="card" style={{ marginTop: '2rem', background: '#f9fafb', borderColor: '#e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Change Password</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#666' }}
                >
                    ×
                </button>
            </div>

            <form id="change-password-form" action={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="currentPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Current Password</label>
                    <input type="password" name="currentPassword" className="input" required style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="newPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>New Password</label>
                    <input type="password" name="newPassword" className="input" minLength={4} required style={{ width: '100%' }} />
                </div>

                {message && <div style={{ marginBottom: '1rem', color: '#059669', fontSize: '0.875rem' }}>{message}</div>}
                {error && <div style={{ marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isPending}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        {isPending ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
}
