import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking admin user in DB...');
    const user = await prisma.user.findUnique({
        where: { email: 'admin@simsai.com' }
    });

    if (!user) {
        console.log('❌ User admin@simsai.com NOT FOUND');
    } else {
        console.log('✅ User Found:');
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);

        const isMatch = await bcrypt.compare('simsai123', user.password);
        console.log(`Password 'simsai123' matches? ${isMatch ? '✅ YES' : '❌ NO'}`);

        if (!isMatch) {
            console.log('Attempting to check previous password...');
            const isOldMatch = await bcrypt.compare('SlaveofALLAH1$', user.password);
            console.log(`Password 'SlaveofALLAH1$' matches? ${isOldMatch ? '✅ YES' : '❌ NO'}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
