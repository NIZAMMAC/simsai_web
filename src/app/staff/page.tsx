import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { ReviewActions } from './review-actions';

export default async function StaffDashboardPage() {
    const userId = await requireUser();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'STAFF') {
        return <div>Access Denied. Staff only area.</div>;
    }

    const submissions = await prisma.submission.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            student: {
                select: { name: true, email: true }
            }
        }
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="branding-logo" style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                    <span className="text-sims">SIMS</span> <span className="text-ai">AI</span>
                </h1>
                <h2 style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    Staff Dashboard
                </h2>
                <p style={{ color: '#666', fontSize: '1.25rem' }}>Admin Panel - Verify Student Work</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {submissions.map((sub) => (
                    <div key={sub.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{sub.title}</h3>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                background: sub.status === 'APPROVED' ? 'var(--success)' : sub.status === 'REJECTED' ? 'var(--error)' : 'var(--warning)',
                                color: '#fff',
                                height: 'fit-content'
                            }}>
                                {sub.status}
                            </span>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                            Student: <span style={{ color: '#fff' }}>{sub.student.name}</span> ({sub.student.email})
                        </p>

                        <p style={{ fontSize: '0.875rem' }}>{sub.description || 'No description provided.'}</p>

                        <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', padding: '1rem', textAlign: 'center' }}>
                            {sub.fileType === 'VIDEO' ? (
                                <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
                                    <source src={sub.fileUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={sub.fileUrl} alt={sub.title} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                            )}
                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                                <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Open original file</a>
                            </div>
                        </div>

                        {sub.status === 'PENDING' && (
                            <ReviewActions submissionId={sub.id} />
                        )}
                    </div>
                ))}

                {submissions.length === 0 && (
                    <p style={{ color: '#666' }}>No pending work to verify.</p>
                )}
            </div>

            <footer style={{ textAlign: 'center', marginTop: '3rem', paddingBottom: '2rem' }}>
                <form action={async () => {
                    'use server';
                    const { deleteSession } = await import('@/lib/session');
                    const { redirect } = await import('next/navigation');
                    await deleteSession();
                    redirect('/login');
                }}>
                    <button className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', background: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}>Logout</button>
                </form>
            </footer>
        </div>
    );
}
