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
            include: {
                taxis: {
                    take: 1, // Assume first taxi for profile purposes
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!driver) {
            return NextResponse.json({ error: 'Chauffeur introuvable' }, { status: 404 });
        }

        // Flatten taxi info for easier consumption by mobile app
        const taxi = driver.taxis[0] || null;
        const driverProfile = {
            id: driver.id,
            name: driver.name,
            email: driver.email,
            phone: driver.phone,
            licenseNumber: driver.licenseNumber,
            photoUrl: driver.photoUrl,
            taxi: taxi ? {
                id: taxi.id,
                plateNumber: taxi.plateNumber,
                model: taxi.model,
                doorNumber: taxi.doorNumber,
                company: taxi.company,
                status: taxi.status
            } : null
        };

        return NextResponse.json(driverProfile, {
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
        const { id, name, phone, licenseNumber, email, taxi } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID du chauffeur requis' }, { status: 400 });
        }

        // Update Driver
        const updatedDriver = await prisma.driver.update({
            where: { id },
            data: {
                name,
                phone,
                licenseNumber,
                email,
            },
        });

        // Update or Create Taxi if info provided
        if (taxi && taxi.plateNumber) {
            // Find existing taxi for this driver or with this plate
            const existingTaxi = await prisma.taxi.findFirst({
                where: {
                    OR: [
                        { driverId: id },
                        { plateNumber: taxi.plateNumber }
                    ]
                }
            });

            if (existingTaxi) {
                await prisma.taxi.update({
                    where: { id: existingTaxi.id },
                    data: {
                        plateNumber: taxi.plateNumber,
                        model: taxi.model || 'Inconnu',
                        doorNumber: taxi.doorNumber,
                        company: taxi.company,
                        driverId: id, // Ensure it's linked
                    }
                });
            } else {
                await prisma.taxi.create({
                    data: {
                        plateNumber: taxi.plateNumber,
                        model: taxi.model || 'Inconnu',
                        doorNumber: taxi.doorNumber,
                        company: taxi.company,
                        driverId: id,
                    }
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Profil et véhicule mis à jour avec succès',
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
