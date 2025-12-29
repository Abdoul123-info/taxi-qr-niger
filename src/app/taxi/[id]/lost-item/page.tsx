import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default async function LostItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    async function submitLostItem(formData: FormData) {
        'use server';
        const description = formData.get('description') as string;
        const contact = formData.get('contact') as string;

        await prisma.lostItem.create({
            data: {
                taxiId: id,
                description,
                contactInfo: contact,
                status: 'REPORTED',
            }
        });

        redirect(`/taxi/${id}?success=lostitem`);
    }

    const taxi = await prisma.taxi.findUnique({ where: { id } });

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <div className="w-full max-w-md flex justify-start mb-4">
                <a href={`/taxi/${id}`} className="text-gray-500 flex items-center hover:text-gray-800">
                    <span className="text-xl mr-2">←</span> Retour
                </a>
            </div>

            <h1 className="text-2xl font-bold text-orange-600 mb-2">🎒 Objet Perdu</h1>
            <p className="text-gray-600 mb-6 text-center">
                Signaler un objet oublié dans le Taxi <span className="font-bold">{taxi?.plateNumber}</span>.
            </p>

            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                <form action={submitLostItem} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description de l'objet</label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Ex: Sac à main noir, téléphone Samsung..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Votre Contact (Tél/Email)</label>
                        <input
                            name="contact"
                            type="text"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Ex: 99 00 00 00"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
                    >
                        Signaler la perte
                    </button>
                </form>
            </div>

            <a href={`/taxi/${id}`} className="mt-6 text-gray-500 text-sm hover:underline">
                ← Retour au profil
            </a>
        </div>
    );
}
