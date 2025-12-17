import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log("Login attempt:", email);

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis.' },
                { status: 400 }
            );
        }

        // Find driver by email
        const driver = await prisma.driver.findUnique({
            where: { email: email },
        });

        if (!driver) {
            return NextResponse.json(
                { error: 'Compte introuvable.' },
                { status: 404 }
            );
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, driver.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Mot de passe incorrect.' },
                { status: 401 }
            );
        }

        // Return user info
        return NextResponse.json({
            success: true,
            user: {
                id: driver.id,
                name: driver.name,
                email: driver.email,
                phone: driver.phone,
                licenseNumber: driver.licenseNumber
            }
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur.' },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
