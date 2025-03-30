import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json();

    // Check if the user is already existed
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ message: "The mail has already been registerednode -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"" }, { status: 400 });
    }

    // Password Encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    return NextResponse.json({ user });
}
