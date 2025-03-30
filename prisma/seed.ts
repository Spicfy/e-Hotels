// prisma/seed.ts

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = "admin@uotel.com";
    const password = "Admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: "Moderator",
                isAdmin: true,
            },
        });
        console.log("✅ Moderator Account Successfully Created");
    } else {
        console.log("⚠️ Moderator Account Already Exist");
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });
