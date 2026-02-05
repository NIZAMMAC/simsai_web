import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Set final admin password
    const hashedPassword = await bcrypt.hash('HADImonu1$', 10);

    await prisma.user.update({
        where: { email: 'admin@simsai.com' },
        data: {
            password: hashedPassword,
        }
    });

    console.log('✅ Admin password updated');
    console.log('📧 Email: admin@simsai.com');
    console.log('🔑 Password: HADImonu1$');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
