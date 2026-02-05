'use server';

import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function verifySubmission(submissionId: string, status: 'APPROVED' | 'REJECTED', feedback?: string) {
    const userId = await requireUser();

    // Verify user is staff or admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'STAFF' && user?.role !== 'MASTER_ADMIN') {
        return { error: 'Unauthorized' };
    }

    await prisma.submission.update({
        where: { id: submissionId },
        data: {
            status,
            feedback: feedback || null
        },
    });

    revalidatePath('/staff');
    revalidatePath('/dashboard');
}
