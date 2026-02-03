'use server';

import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function deleteSubmission(submissionId: string) {
    try {
        const userId = await requireUser();

        // Find the submission and verify ownership
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) {
            return { error: 'Submission not found' };
        }

        if (submission.studentId !== userId) {
            return { error: 'Unauthorized' };
        }

        // Delete the physical file
        const uploadsDir = join(process.cwd(), 'uploads');
        const filename = submission.fileUrl.split('/').pop();
        if (filename) {
            try {
                await unlink(join(uploadsDir, filename));
            } catch (err) {
                console.error('Failed to delete file:', err);
                // Continue even if file deletion fails
            }
        }

        // Delete from database
        await prisma.submission.delete({
            where: { id: submissionId }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Delete submission error:', error);
        return { error: 'Failed to delete submission' };
    }
}
