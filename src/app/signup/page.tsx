'use client';

import { useActionState, useState } from 'react';
import { signup } from '@/app/actions/auth';
import Link from 'next/link';

const DEPARTMENTS = [
    { value: 'COMPUTER_SCIENCE', label: 'Computer Science Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
    { value: 'MECHANICAL', label: 'Mechanical Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'AI', label: 'AI Engineering' },
    { value: 'AUTOMOBILE', label: 'Automobile Engineering' }
];

export default function SignupPage() {
    const [state, action, isPending] = useActionState(signup, { error: '' });
    const [courseType, setCourseType] = useState('BTECH');

    const maxSemester = courseType === 'BTECH' ? 8 : 6;
    const semesters = Array.from({ length: maxSemester }, (_, i) => i + 1);

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem 1.5rem' }}>
                <h1 className="branding-logo text-responsive-logo" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <span className="text-sims">SIMS</span> <span className="text-ai">AI</span>
                </h1>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 500 }}>Student Sign Up</h2>

                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Full Name</label>
                        <input type="text" id="name" name="name" className="input" placeholder="John Doe" required />
                    </div>

                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Email Address</label>
                        <input type="email" id="email" name="email" className="input" placeholder="john@example.com" required />
                    </div>

                    <div>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Password</label>
                        <input type="password" id="password" name="password" className="input" placeholder="••••••••" required />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '0.5rem 0' }} />

                    <div>
                        <label htmlFor="courseType" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Course Type</label>
                        <select
                            id="courseType"
                            name="courseType"
                            className="input"
                            value={courseType}
                            onChange={(e) => setCourseType(e.target.value)}
                            required
                        >
                            <option value="BTECH">B.Tech</option>
                            <option value="POLYTECHNIC">Polytechnic</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="department" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Department</label>
                        <select id="department" name="department" className="input" required>
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept.value} value={dept.value}>{dept.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="semester" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 500 }}>Current Semester</label>
                        <select id="semester" name="semester" className="input" required>
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    <input type="hidden" name="role" value="STUDENT" />

                    {state?.error && (
                        <div style={{ color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center', padding: '0.75rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
                            {state.error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={isPending} style={{ fontSize: '1.05rem', padding: '0.875rem', marginTop: '0.5rem' }}>
                        {isPending ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                    Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
