'use server';

import { z } from 'zod'; // I'll need to install zod or just do manual validation for now to save time
import { prisma } from '@/lib/db';
import { hash, compare } from 'bcryptjs';
import { createSession, deleteSession, requireUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: FormData) {
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.toLowerCase()?.trim();
    const password = (formData.get('password') as string)?.trim();
    const role = formData.get('role') as string || 'STUDENT';
    const courseType = formData.get('courseType') as string || null;
    const department = formData.get('department') as string || null;
    const semester = formData.get('semester') ? parseInt(formData.get('semester') as string) : null;

    if (!name || !email || !password) {
        return { error: 'All fields are required' };
    }

    // Validate student-specific fields
    if (role === 'STUDENT') {
        if (!courseType || !department || !semester) {
            return { error: 'Please select course type, department, and semester' };
        }

        // Validate semester based on course type
        const maxSemester = courseType === 'BTECH' ? 8 : 6;
        if (semester < 1 || semester > maxSemester) {
            return { error: `Invalid semester for ${courseType}` };
        }
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
            ...(role === 'STUDENT' && {
                courseType,
                department,
                semester
            })
        },
    });

    await createSession(user.id);

    // Redirect based on role
    if (user.role === 'STAFF' || user.role === 'MASTER_ADMIN') {
        redirect('/staff');
    } else {
        redirect('/dashboard');
    }
}

export async function login(prevState: any, formData: FormData) {
    const email = (formData.get('email') as string)?.toLowerCase()?.trim();
    const password = (formData.get('password') as string)?.trim();

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

    if (user.role === 'STAFF' || user.role === 'MASTER_ADMIN') {
        redirect('/staff');
    } else {
        redirect('/dashboard');
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = (formData.get('email') as string)?.toLowerCase();

    if (!email) {
        return { error: 'Email is required' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // For security, checking if user exists but generic message
        if (user && user.role === 'STUDENT') {
            await prisma.user.update({
                where: { email },
                data: {
                    resetRequestedAt: new Date()
                }
            });
        }

        return { success: true, message: 'If an account exists, a reset request has been sent to the admin.' };
    } catch (error) {
        console.error('Password reset request error:', error);
        return { error: 'Failed to process request' };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const userId = await requireUser();
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    if (!currentPassword || !newPassword) {
        return { error: 'All fields are required' };
    }

    if (newPassword.length < 4) {
        return { error: 'New password must be at least 4 characters' };
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: 'User not found' };

        // Verify current password
        const passwordsMatch = await compare(currentPassword, user.password);
        if (!passwordsMatch) {
            return { error: 'Incorrect current password' };
        }

        // Hash new password
        const hashedNewPassword = await hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                resetRequestedAt: null // Clear any pending reset flags if present
            }
        });

        return { success: true, message: 'Password updated successfully' };
    } catch (error) {
        console.error('Change password error:', error);
        return { error: 'Failed to update password' };
    }
}
