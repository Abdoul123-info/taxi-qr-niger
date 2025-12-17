import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function TaxiListPage() {
    const taxis = await prisma.taxi.findMany({
        include: { driver: true }, // Include driver relations
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Taxis</h1>
                <Link
                    href="/admin/taxis/new"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold shadow-sm transition"
                >
                    + Nouveau Taxi
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-green-50 text-green-800">
                        <tr>
                            <th className="p-4 font-semibold border-b border-green-100">Portière</th>
                            <th className="p-4 font-semibold border-b border-green-100">Immatriculation</th>
                            <th className="p-4 font-semibold border-b border-green-100">Compagnie</th>
                            <th className="p-4 font-semibold border-b border-green-100">Modèle</th>
                            <th className="p-4 font-semibold border-b border-green-100">Chauffeur</th>
                            <th className="p-4 font-semibold border-b border-green-100">Statut</th>
                            <th className="p-4 font-semibold border-b border-green-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxis.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    Aucun taxi enregistré pour le moment.
                                </td>
                            </tr>
                        ) : (
                            taxis.map((taxi) => (
                                <tr key={taxi.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                    <td className="p-4 font-bold text-green-800">{taxi.doorNumber || "---"}</td>
                                    <td className="p-4 font-medium text-gray-900">{taxi.plateNumber}</td>
                                    <td className="p-4 text-gray-600 text-sm">{taxi.company || "Indépendant"}</td>
                                    <td className="p-4 text-gray-600">{taxi.model}</td>
                                    <td className="p-4 text-gray-600">
                                        {taxi.driver?.name || <span className="text-red-400 italic">Non assigné</span>}
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={taxi.status} />
                                    </td>
                                    <td className="p-4 flex space-x-2">
                                        <Link
                                            href={`/admin/taxis/${taxi.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            Détails
                                        </Link>
                                        <span className="text-gray-300">|</span>
                                        <Link
                                            href={`/taxi/${taxi.id}`}
                                            target="_blank"
                                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                                        >
                                            Voir Public
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-600';

    if (status === 'AVAILABLE') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
    } else if (status === 'BUSY') {
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-700';
    } else if (status === 'MAINTENANCE') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
    }

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${bgColor} ${textColor}`}>
            {status}
        </span>
    );
}
