import Link from 'next/link';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export default async function DriverListPage() {
    const drivers = await prisma.driver.findMany({
        include: { taxis: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Liste des Chauffeurs (App Mobile)</h1>
                {/* 
                <Link
                    href="/admin/drivers/new"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold shadow-sm transition"
                >
                    + Nouveau Chauffeur
                </Link>
                */}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-green-50 text-green-800">
                        <tr>
                            <th className="p-4 font-semibold border-b border-green-100">Nom</th>
                            <th className="p-4 font-semibold border-b border-green-100">Email</th>
                            <th className="p-4 font-semibold border-b border-green-100">Permis</th>
                            <th className="p-4 font-semibold border-b border-green-100">Véhicules</th>
                            <th className="p-4 font-semibold border-b border-green-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Aucun chauffeur enregistré pour le moment.
                                </td>
                            </tr>
                        ) : (
                            drivers.map((driver) => (
                                <tr key={driver.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                    <td className="p-4 font-medium text-gray-900">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                                👤
                                            </div>
                                            <span>{driver.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 font-mono text-sm">{driver.email}</td>
                                    <td className="p-4 text-gray-600">{driver.licenseNumber || "---"}</td>
                                    <td className="p-4">
                                        {driver.taxis.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {driver.taxis.map(taxi => (
                                                    <span key={taxi.id} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                                        {taxi.plateNumber}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-sm">Aucun véhicule</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <Link
                                            href={`/admin/drivers/${driver.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            Détails
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
