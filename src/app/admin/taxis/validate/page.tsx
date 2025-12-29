import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { validateTaxi } from '../actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ValidateTaxiPage() {
    const pendingTaxis = await prisma.taxi.findMany({
        where: { status: 'PENDING_ADMIN' },
        include: { driver: true },
        orderBy: { createdAt: 'desc' }
    });

    async function handleValidate(formData: FormData) {
        'use server';
        const taxiId = formData.get('taxiId') as string;
        await validateTaxi(taxiId);
        redirect('/admin/taxis');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/taxis" className="text-sm text-gray-500 hover:text-gray-700 flex items-center mb-2">
                        ← Retour aux taxis
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Ajouter un Taxi (Validation)</h1>
                    <p className="text-gray-600">Liste des chauffeurs ayant soumis leurs informations véhicule</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-orange-50 text-orange-800">
                        <tr>
                            <th className="p-4 font-semibold border-b border-orange-100">N° Portière (Cliquer pour ajouter)</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Immatriculation</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Chauffeur</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Modèle</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Compagnie</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingTaxis.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <div className="text-4xl mb-2">🎈</div>
                                    Aucun nouveau taxi en attente de validation.
                                </td>
                            </tr>
                        ) : (
                            pendingTaxis.map((taxi) => (
                                <tr key={taxi.id} className="hover:bg-orange-50 transition border-b border-gray-100 last:border-0">
                                    <td className="p-4">
                                        <form action={handleValidate}>
                                            <input type="hidden" name="taxiId" value={taxi.id} />
                                            <button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-lg font-black shadow-md transition transform hover:scale-105"
                                                title="Cliquer pour valider et ajouter ce taxi"
                                            >
                                                #{taxi.doorNumber || "???"}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">{taxi.plateNumber}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{taxi.driver?.name || "Inconnu"}</div>
                                        <div className="text-xs text-gray-500">{taxi.driver?.email}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{taxi.model}</td>
                                    <td className="p-4 text-gray-600 text-sm">{taxi.company || "Indépendant"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
