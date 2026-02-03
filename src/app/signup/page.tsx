'use client';

import { useActionState } from 'react';
import { signup } from '@/app/actions/auth';
import Link from 'next/link';

export default function SignupPage() {
    // useActionState is the new hook for actions in React 19 / Next.js 15, 
    // but if on older version might need useFormState from react-dom
    // creates-next-app installed "next", "react", "react-dom". checking compatibility.
    // Assuming React 19/Canary or latest Next.js 14/15. If it fails, I'll fallback to useFormState.

    // For safety given "latest", I'll try to import useFormState from react-dom if useActionState isn't available,
    // but since we are in a file, I have to pick one.
    // Next 15 uses 'react' for useActionState. Next 14 uses 'react-dom' for useFormState.
    // I'll stick to a simpler form submission for now without the hook if unsure, or use the hook.
    // Let's assume standard Next.js 15 since I ran create-next-app@latest.

    const [state, action, isPending] = useActionState(signup, { error: '' });

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Sign Up</h1>

                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                        <input type="text" id="name" name="name" className="input" placeholder="John Doe" required />
                    </div>

                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                        <input type="email" id="email" name="email" className="input" placeholder="john@example.com" required />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input type="password" id="password" name="password" className="input" placeholder="••••••••" required />
                    </div>

                    {/* Hidden role input - defaulting to STUDENT. Staff creation can be manual or secret code later */}
                    <input type="hidden" name="role" value="STUDENT" />

                    {state?.error && (
                        <div style={{ color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {state.error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={isPending}>
                        {isPending ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#a3a3a3', fontSize: '0.875rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
