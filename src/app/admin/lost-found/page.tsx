import { prisma } from '@/lib/prisma';

export default async function AdminLostFoundPage() {
    const items = await prisma.lostItem.findMany({
        include: { taxi: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Objets Perdus Signalés</h1>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-orange-50 text-orange-900">
                        <tr>
                            <th className="p-4 font-semibold border-b border-orange-100">Date</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Taxi</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Objet</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Contact</th>
                            <th className="p-4 font-semibold border-b border-orange-100">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Aucun objet signalé.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                    <td className="p-4 text-gray-600 text-sm">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">
                                        {item.taxi?.plateNumber || <span className="text-gray-400 italic">Inconnu</span>}
                                    </td>
                                    <td className="p-4 text-gray-700">
                                        {item.description}
                                    </td>
                                    <td className="p-4 text-blue-600 font-medium">
                                        {item.contactInfo}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-bold">
                                            {item.status}
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
