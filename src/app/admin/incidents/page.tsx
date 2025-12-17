import { prisma } from '@/lib/prisma';

export default async function AdminIncidentsPage() {
    const incidents = await prisma.incident.findMany({
        include: { taxi: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Incidents Signalés</h1>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-red-50 text-red-900">
                        <tr>
                            <th className="p-4 font-semibold border-b border-red-100">Date</th>
                            <th className="p-4 font-semibold border-b border-red-100">Taxi</th>
                            <th className="p-4 font-semibold border-b border-red-100">Description</th>
                            <th className="p-4 font-semibold border-b border-red-100">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Aucun incident signalé.
                                </td>
                            </tr>
                        ) : (
                            incidents.map((incident) => (
                                <tr key={incident.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                    <td className="p-4 text-gray-600 text-sm">
                                        {new Date(incident.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">
                                        {incident.taxi?.plateNumber || <span className="text-gray-400 italic">Inconnu</span>}
                                    </td>
                                    <td className="p-4 text-gray-700">
                                        {incident.description}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">
                                            {incident.status}
                                        </span>
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
