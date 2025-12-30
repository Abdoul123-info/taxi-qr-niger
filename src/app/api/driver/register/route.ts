import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, licenseNumber, taxi } = body;

        // Basic validation
        if (!name || !email || !password || !licenseNumber) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis.' },
                {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Check if email already exists
        const existingDriver = await prisma.driver.findUnique({
            where: { email },
        });

        if (existingDriver) {
            return NextResponse.json(
                { error: 'Cet email est déjà utilisé.' },
                {
                    status: 409,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Driver and potentially Taxi in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const newDriver = await tx.driver.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    licenseNumber,
                },
            });

            if (taxi && taxi.plateNumber) {
                await tx.taxi.create({
                    data: {
                        plateNumber: taxi.plateNumber,
                        model: taxi.model || 'Inconnu',
                        doorNumber: taxi.doorNumber,
                        company: taxi.company,
                        driverId: newDriver.id,
                        status: 'PENDING_ADMIN',
                    }
                });
            }

            return newDriver;
        });

        return NextResponse.json(
            {
                message: 'Compte créé avec succès',
                driver: { id: result.id, name: result.name, email: result.email }
            },
            {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            }
        );

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de l\'inscription.' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
