'use server';

import { z } from 'zod'; // I'll need to install zod or just do manual validation for now to save time
import { prisma } from '@/lib/db';
import { hash, compare } from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string || 'STUDENT'; // Hidden input or default

    if (!name || !email || !password) {
        return { error: 'All fields are required' };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: 'User already exists' };
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });

    await createSession(user.id);

    // Redirect based on role
    if (user.role === 'STAFF') {
        redirect('/staff');
    } else {
        redirect('/dashboard');
    }
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'All fields are required' };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: 'Invalid credentials' };
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
        return { error: 'Invalid credentials' };
    }

    await createSession(user.id);

    if (user.role === 'STAFF') {
        redirect('/staff');
    } else {
        redirect('/dashboard');
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
