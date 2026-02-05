import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { fixAdminAccount } from './actions';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const dbUrl = process.env.DATABASE_URL || 'NOT_SET';
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');

    const userCount = await prisma.user.count();

    const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@simsai.com' }
    });

    const mobileUser = await prisma.user.findUnique({
        where: { email: 'mobile@simsai.com' }
    });

    let adminPassCheck = 'N/A';
    if (adminUser) {
        // Checking for 'HADImonu1$'
        const match = await bcrypt.compare('HADImonu1$', adminUser.password);
        adminPassCheck = match ? 'MATCHES HADImonu1$' : 'FAIL';
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Debug Info</h1>

            <form action={async () => {
                'use server';
                await fixAdminAccount();
            }} style={{ marginBottom: '2rem', padding: '1rem', background: '#fee2e2', border: '2px solid #ef4444' }}>
                <h3>⚠️ Emergency Fix</h3>
                <p>Click this to force the database to update right now.</p>
                <button type="submit" style={{ padding: '1rem', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>
                    🛠️ FIX ADMIN ACCOUNTS
                </button>
            </form>

            <p><strong>DB URL:</strong> {maskedUrl}</p>
            <p><strong>Total Users:</strong> {userCount}</p>

            <hr />

            <h2>Admin User</h2>
            <pre>
                {adminUser ? JSON.stringify(adminUser, null, 2) : 'NOT FOUND'}
            </pre>
            <p>Password Check: {adminPassCheck}</p>

            <hr />

            <h2>Mobile User</h2>
            <pre>
                {mobileUser ? JSON.stringify(mobileUser, null, 2) : 'NOT FOUND'}
            </pre>
        </div>
    );
}
