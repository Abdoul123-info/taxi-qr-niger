import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const doorNumber = searchParams.get('doorNumber');

    if (!doorNumber) {
        return NextResponse.json({ error: 'Numéro de portière manquant' }, { status: 400 });
    }

    try {
        const taxi = await prisma.taxi.findFirst({
            where: {
                doorNumber: doorNumber,
            },
            select: {
                id: true,
            },
        });

        if (!taxi) {
            return NextResponse.json({ error: 'Taxi introuvable' }, { status: 404 });
        }

        return NextResponse.json({ id: taxi.id });
    } catch (error) {
        console.error('Search Proxy Error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
