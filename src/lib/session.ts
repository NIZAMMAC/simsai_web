import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const cookieStore = await cookies();

    cookieStore.set('session', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    return session;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function requireUser() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }
    return session;
}
