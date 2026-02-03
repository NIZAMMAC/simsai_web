import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/session';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> } // Params are promises in Next 15
) {
    // Ensure user is logged in to view files (optional security)
    await requireUser();

    const { filename } = await params;
    const filePath = join(process.cwd(), 'uploads', filename);

    try {
        const fileBuffer = await readFile(filePath);

        // Determine content type (basic)
        const ext = filename.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) contentType = `image/${ext}`;
        if (['mp4', 'webm'].includes(ext || '')) contentType = `video/${ext}`;

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('File not found', { status: 404 });
    }
}
