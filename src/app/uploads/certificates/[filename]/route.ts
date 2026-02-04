import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/session';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    // Ensure user is logged in
    await requireUser();

    const { filename } = await params;

    // Path to the certificates directory
    const filePath = join(process.cwd(), 'uploads', 'certificates', filename);

    try {
        const fileBuffer = await readFile(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Disposition': `inline; filename="${filename}"`
            },
        });
    } catch (error) {
        console.error('Error serving certificate:', error);
        return new NextResponse('Certificate not found', { status: 404 });
    }
}
