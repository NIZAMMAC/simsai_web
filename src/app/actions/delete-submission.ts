'use server';

import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { del } from '@vercel/blob';

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

        // Delete the file from Vercel Blob
        if (submission.fileUrl) {
            try {
                await del(submission.fileUrl);
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
