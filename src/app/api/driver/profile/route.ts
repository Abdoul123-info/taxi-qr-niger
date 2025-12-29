import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const driverId = searchParams.get('id');

        if (!driverId) {
            return NextResponse.json({ error: 'ID du chauffeur requis' }, { status: 400 });
        }

        const driver = await prisma.driver.findUnique({
            where: { id: driverId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                licenseNumber: true,
                photoUrl: true,
            }
        });

        if (!driver) {
            return NextResponse.json({ error: 'Chauffeur introuvable' }, { status: 404 });
        }

        return NextResponse.json(driver, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, name, phone, licenseNumber } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID du chauffeur requis' }, { status: 400 });
        }

        const updatedDriver = await prisma.driver.update({
            where: { id },
            data: {
                name,
                phone,
                licenseNumber,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            driver: {
                id: updatedDriver.id,
                name: updatedDriver.name,
                email: updatedDriver.email,
                phone: updatedDriver.phone,
                licenseNumber: updatedDriver.licenseNumber
            }
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
