'use server';

import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function uploadFile(formData: FormData) {
    const sessionUserId = await requireUser();

    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const submissionId = formData.get('submissionId') as string | null;

    // If editing, file is optional
    if ((!file || file.size === 0) && !submissionId) {
        return { error: 'File and title are required' };
    }

    if (!title) {
        return { error: 'Title is required' };
    }

    let fileUrl: string | undefined;
    let fileType: 'IMAGE' | 'VIDEO' | undefined;

    // Process file if provided
    if (file && file.size > 0) {
        // Basic validation
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            return { error: 'Only images and videos are allowed' };
        }

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
        });

        fileUrl = blob.url;
        fileType = isVideo ? 'VIDEO' : 'IMAGE';

        // If editing, delete old file
        if (submissionId) {
            const oldSubmission = await prisma.submission.findUnique({
                where: { id: submissionId }
            });
            if (oldSubmission && oldSubmission.studentId === sessionUserId) {
                try {
                    // Start of blob url or just try deleting
                    await del(oldSubmission.fileUrl);
                } catch (err) {
                    console.error('Failed to delete old file:', err);
                }
            }
        }
    }

    // Update or Create
    if (submissionId) {
        // Verify ownership
        const existing = await prisma.submission.findUnique({
            where: { id: submissionId }
        });

        if (!existing || existing.studentId !== sessionUserId) {
            return { error: 'Unauthorized' };
        }

        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                title,
                description,
                ...(fileUrl && { fileUrl }),
                ...(fileType && { fileType }),
            },
        });
    } else {
        // Create new
        await prisma.submission.create({
            data: {
                title,
                description,
                fileUrl: fileUrl!,
                fileType: fileType!,
                status: 'PENDING',
                studentId: sessionUserId,
            },
        });
    }

    revalidatePath('/dashboard');
    return { success: true };
}
