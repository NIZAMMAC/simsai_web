import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@simsai.com' },
            update: {
                password: hashedPassword,
                name: 'Admin Staff',
                role: 'STAFF'
            },
            create: {
                email: 'admin@simsai.com',
                password: hashedPassword,
                name: 'Admin Staff',
                role: 'STAFF'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user created/reset successfully',
            user: { email: admin.email, role: admin.role }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
