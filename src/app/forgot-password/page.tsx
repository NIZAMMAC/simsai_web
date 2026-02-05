'use client';

import { useTransition, useState } from 'react';
import { requestPasswordReset } from '@/app/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (formData: FormData) => {
        setMessage('');
        setError('');
        startTransition(async () => {
            const result = await requestPasswordReset(null, formData);
            if (result.error) {
                setError(result.error);
            } else {
                setMessage(result.message || 'Request sent');
            }
        });
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
                <h1 className="branding-logo" style={{ fontSize: '3rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <span className="text-sims">SIMS</span> <span className="text-ai">AI</span>
                </h1>
                <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 500 }}>Reset Password</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                    Enter your email to request a password reset from the admin.
                </p>

                {message ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            padding: '1rem',
                            background: '#d1fae5',
                            color: '#059669',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            {message}
                        </div>
                        <Link href="/login" className="btn btn-primary">Back to Login</Link>
                    </div>
                ) : (
                    <form action={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 500 }}>Email Address</label>
                            <input type="email" id="email" name="email" className="input" placeholder="john@example.com" required />
                        </div>

                        {error && (
                            <div style={{ color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" disabled={isPending} style={{ width: '100%', fontSize: '1.125rem', padding: '1rem' }}>
                            {isPending ? 'Sending...' : 'Request Reset'}
                        </button>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link href="/login" style={{ color: '#666' }}>Cancel</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
