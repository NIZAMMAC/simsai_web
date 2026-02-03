'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
    const [state, action, isPending] = useActionState(login, { error: '' });

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
                <h1 className="branding-logo" style={{ fontSize: '4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <span className="text-sims">SIMS</span> <span className="text-ai">AI</span>
                </h1>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem', fontWeight: 500 }}>Login</h2>

                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 500 }}>Email Address</label>
                        <input type="email" id="email" name="email" className="input" placeholder="john@example.com" required />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 500 }}>Password</label>
                        <input type="password" id="password" name="password" className="input" placeholder="••••••••" required />
                    </div>

                    {state?.error && (
                        <div style={{ color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {state.error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={isPending} style={{ fontSize: '1.25rem', padding: '1rem 2rem', marginTop: '0.5rem' }}>
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '1rem' }}>
                    Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
