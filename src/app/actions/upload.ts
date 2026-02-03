'use server';

import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Creates/ensures upload dir exists
        const uploadDir = join(process.cwd(), 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            console.error('Error creating directory', e);
        }

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        fileUrl = `/uploads/${filename}`;
        fileType = isVideo ? 'VIDEO' : 'IMAGE';

        // If editing, delete old file
        if (submissionId) {
            const oldSubmission = await prisma.submission.findUnique({
                where: { id: submissionId }
            });
            if (oldSubmission && oldSubmission.studentId === sessionUserId) {
                try {
                    const { unlink } = await import('fs/promises');
                    const oldFilename = oldSubmission.fileUrl.split('/').pop();
                    if (oldFilename) {
                        await unlink(join(uploadDir, oldFilename));
                    }
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
