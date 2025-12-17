'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function assignDriver(taxiId: string, driverId: string) {
    if (!taxiId || !driverId) {
        return { error: "ID manquant" };
    }

    try {
        await prisma.taxi.update({
            where: { id: taxiId },
            data: { driverId: driverId }
        });

        revalidatePath(`/admin/taxis/${taxiId}`);
        revalidatePath(`/admin/taxis`);
        return { success: true };
    } catch (error) {
        console.error("Assign Driver Error:", error);
        return { error: "Erreur lors de l'assignation" };
    }
}
