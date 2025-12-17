import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    async function submitIncident(formData: FormData) {
        'use server';
        const description = formData.get('description') as string;

        await prisma.incident.create({
            data: {
                taxiId: id,
                type: 'OTHER', // Default type
                description,
                // status field removed as it does not exist in schema
            }
        });

        // Determine path for redirect - simpler to just go back to profile with a flag or just back
        redirect(`/taxi/${id}?success=incident`);
    }

    const taxi = await prisma.taxi.findUnique({ where: { id } });

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-md flex justify-start mb-4">
                <a href={`/taxi/${id}`} className="text-gray-500 flex items-center hover:text-gray-800">
                    <span className="text-xl mr-2">←</span> Retour
                </a>
            </div>

            <h1 className="text-2xl font-bold text-red-600 mb-2">🚨 Signaler un Incident</h1>
            <p className="text-gray-600 mb-6 text-center">
                Vous signalez un problème avec le Taxi <span className="font-bold">{taxi?.plateNumber}</span>.
            </p>

            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-red-100">
                <form action={submitIncident} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description de l'incident</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="Ex: Conduite dangereuse, refus de prise en charge..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                    >
                        Envoyer le Signalement
                    </button>
                </form>
            </div>

            <a href={`/taxi/${id}`} className="mt-6 text-gray-500 text-sm hover:underline">
                ← Retour au profil
            </a>
        </div>
    );
}
