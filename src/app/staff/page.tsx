import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { StaffDashboardClient } from './staff-dashboard-client';

export default async function StaffDashboardPage() {
    const userId = await requireUser();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'STAFF' && user?.role !== 'MASTER_ADMIN') {
        return <div>Access Denied. Staff only area.</div>;
    }

    const submissions = await prisma.submission.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            description: true,
            fileUrl: true,
            fileType: true,
            status: true,
            certificateFile: true,
            createdAt: true,
            student: {
                select: {
                    name: true,
                    email: true,
                    courseType: true,
                    department: true,
                    semester: true
                }
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
                <p style={{ color: '#666', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Admin Panel - Verify Student Work</p>

                {user?.role === 'MASTER_ADMIN' && (
                    <a href="/staff/users" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
                        👥 Manage Staff Accounts
                    </a>
                )}

                <a href="/staff/requests" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderColor: '#f59e0b', color: '#d97706', background: '#fffbeb' }}>
                    🔑 Password Requests
                </a>
            </header>


            <StaffDashboardClient submissions={submissions} />

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
