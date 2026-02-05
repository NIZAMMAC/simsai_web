'use server';

import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function fixAdminAccount() {
    try {
        console.log('🔧 Starting Admin Fix...');

        const hashedPassword = await hash('HADImonu1$', 10);

        // 1. Fix Main Admin
        const admin = await prisma.user.upsert({
            where: { email: 'admin@simsai.com' },
            update: {
                password: hashedPassword,
                role: 'MASTER_ADMIN',
                name: 'Master Admin'
            },
            create: {
                email: 'admin@simsai.com',
                password: hashedPassword,
                role: 'MASTER_ADMIN',
                name: 'Master Admin'
            }
        });
        console.log('✅ Main Admin Fixed:', admin);

        // 2. Create Mobile Admin (Backup)
        const mobilePass = await hash('1234', 10);
        const mobile = await prisma.user.upsert({
            where: { email: 'mobile@simsai.com' },
            update: {
                password: mobilePass,
                role: 'MASTER_ADMIN',
                name: 'Mobile Admin'
            },
            create: {
                email: 'mobile@simsai.com',
                password: mobilePass,
                role: 'MASTER_ADMIN',
                name: 'Mobile Admin'
            }
        });
        console.log('✅ Mobile Admin Fixed:', mobile);

        revalidatePath('/debug');
        return { success: true, message: 'Admin accounts repaired successfully' };
    } catch (error) {
        console.error('Fix failed:', error);
        return { error: 'Failed to fix accounts: ' + String(error) };
    }
}
