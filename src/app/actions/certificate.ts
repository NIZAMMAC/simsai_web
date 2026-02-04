'use server';

import { prisma } from '@/lib/db';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function uploadCertificate(submissionId: string, formData: FormData) {
    try {
        // Get the file from form data
        const file = formData.get('certificate') as File;
        if (!file) {
            return { error: 'No file provided' };
        }

        // Validate file type (PDF only)
        if (!file.type.includes('pdf')) {
            return { error: 'Only PDF files are allowed' };
        }

        // Get submission and verify it's approved
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) {
            return { error: 'Submission not found' };
        }

        if (submission.status !== 'APPROVED') {
            return { error: 'Can only upload certificates for approved submissions' };
        }

        // Generate filename/path
        const filename = `certificates/${submissionId}-certificate-${Date.now()}.pdf`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
        });

        // Update submission with certificate URL
        await prisma.submission.update({
            where: { id: submissionId },
            data: { certificateFile: blob.url } // Storing URL primarily
        });

        revalidatePath('/staff');
        revalidatePath('/dashboard');

        return { success: true, filename: blob.url };
    } catch (error) {
        console.error('Certificate upload error:', error);
        return { error: 'Failed to upload certificate' };
    }
}

export async function removeCertificate(submissionId: string) {
    try {
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId }
        });

        if (submission?.certificateFile) {
            try {
                await del(submission.certificateFile);
            } catch (error) {
                console.error('Error deleting blob:', error);
            }
        }

        await prisma.submission.update({
            where: { id: submissionId },
            data: { certificateFile: null }
        });

        revalidatePath('/staff');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Certificate removal error:', error);
        return { error: 'Failed to remove certificate' };
    }
}
