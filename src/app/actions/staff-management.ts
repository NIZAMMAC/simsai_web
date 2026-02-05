'use server';

import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import * as bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getStaffUsers() {
    const userId = await requireUser();

    // Allow MASTER_ADMIN to see list. 
    // Ideally regular staff shouldn't see this either, or maybe they can see but not edit.
    // For now we assume only Master Admin accesses the page.
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'MASTER_ADMIN') {
        return [];
    }

    return await prisma.user.findMany({
        where: {
            role: { in: ['STAFF', 'MASTER_ADMIN'] }
        },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
}

export async function createStaffUser(formData: FormData) {
    const adminId = await requireUser();

    // Strict Check: Only MASTER_ADMIN can create staff
    const requester = await prisma.user.findUnique({ where: { id: adminId } });
    if (requester?.role !== 'MASTER_ADMIN') {
        return { error: 'Unauthorized: Only Master Admins can create staff' };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'All fields are required' };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'STAFF' // Created users are regular STAFF by default
            }
        });

        revalidatePath('/staff/users');
        return { success: true };
    } catch (error) {
        console.error('Create staff error:', error);
        return { error: 'Failed to create user. Email might already exist.' };
    }
}

export async function deleteStaffUser(userId: string) {
    const adminId = await requireUser();

    // Prevent self-deletion
    if (userId === adminId) {
        return { error: 'Cannot delete your own account' };
    }

    const requester = await prisma.user.findUnique({ where: { id: adminId } });
    if (requester?.role !== 'MASTER_ADMIN') {
        return { error: 'Unauthorized: Only Master Admins can delete staff' };
    }

    // Optional: Prevent deleting other Master Admins? 
    // For now, allow it, as long as it's not self-deletion.

    try {
        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath('/staff/users');
        return { success: true };
    } catch (error) {
        console.error('Delete staff error:', error);
        return { error: 'Failed to delete user' };
    }
}

export async function getResetRequests() {
    const userId = await requireUser();
    // Allow any staff to see/approve requests
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'STAFF' && user?.role !== 'MASTER_ADMIN') {
        return [];
    }

    return await prisma.user.findMany({
        where: {
            resetRequestedAt: { not: null }
        },
        select: { id: true, name: true, email: true, role: true, resetRequestedAt: true },
        orderBy: { resetRequestedAt: 'asc' }
    });
}

export async function approvePasswordReset(targetUserId: string) {
    const adminId = await requireUser();
    const user = await prisma.user.findUnique({ where: { id: adminId } });

    if (user?.role !== 'STAFF' && user?.role !== 'MASTER_ADMIN') {
        return { error: 'Unauthorized' };
    }

    try {
        const defaultPassword = await bcrypt.hash('1234', 10);

        await prisma.user.update({
            where: { id: targetUserId },
            data: {
                password: defaultPassword,
                resetRequestedAt: null // Clear the request
            }
        });

        revalidatePath('/staff/requests');
        return { success: true };
    } catch (error) {
        console.error('Approve reset error:', error);
        return { error: 'Failed to reset password' };
    }
}
