import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, description, date, time, category, taxiId, contactInfo } = body;

        // Basic validation
        if (!type || !description || !date || !time) {
            return NextResponse.json(
                { error: 'Champs obligatoires manquants (Date, Heure, Type, Description).' },
                { status: 400 }
            );
        }

        // Combine Date and Time into a single DateTime string
        // Assuming date is YYYY-MM-DD and time is HH:MM
        const dateTimeString = `${date}T${time}:00`;
        const occurrenceDate = new Date(dateTimeString);

        if (isNaN(occurrenceDate.getTime())) {
            return NextResponse.json(
                { error: 'Format de date invalide.' },
                { status: 400 }
            );
        }

        if (type === 'INCIDENT') {
            const report = await prisma.incident.create({
                data: {
                    type: category || 'OTHER', // e.g., SPEEDING, RUDE
                    description: description,
                    occurrenceDate: occurrenceDate,
                    taxiId: taxiId || null, // Optional
                }
            });
            return NextResponse.json({ success: true, id: report.id, message: 'Incident signalé.' }, { status: 201 });
        } else if (type === 'LOST_ITEM') {
            const report = await prisma.lostItem.create({
                data: {
                    description: description,
                    contactInfo: contactInfo || 'Non spécifié',
                    status: 'REPORTED',
                    occurrenceDate: occurrenceDate,
                    taxiId: taxiId || null, // Optional
                }
            });
            return NextResponse.json({ success: true, id: report.id, message: 'Objet perdu signalé.' }, { status: 201 });
        } else {
            return NextResponse.json(
                { error: 'Type de signalement invalide.' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Reporting Error:', error);
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
