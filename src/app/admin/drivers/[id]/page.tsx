import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const driver = await prisma.driver.findUnique({
        where: { id },
        include: { taxis: true }
    });

    if (!driver) {
        return <div className="p-8 text-center text-red-500 font-bold">Chauffeur introuvable</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/drivers" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <span className="mr-1">←</span> Retour à la liste
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                            <span className="bg-orange-100 p-2 rounded-full mr-3 text-orange-600">👤</span>
                            Profil du Chauffeur
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Nom Complet</label>
                                <p className="text-lg font-medium text-gray-900">{driver.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                <p className="text-lg font-medium text-gray-900 font-mono text-sm">{driver.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Numéro de Permis</label>
                                <p className="text-lg font-medium text-gray-900">{driver.licenseNumber || "---"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Téléphone</label>
                                <p className="text-lg font-medium text-gray-900">{driver.phone || "---"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Associated Taxis */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                            <span className="bg-green-100 p-2 rounded-full mr-3 text-green-600">🚕</span>
                            Véhicules Assignés ({driver.taxis.length})
                        </h2>

                        {driver.taxis.length > 0 ? (
                            <div className="space-y-3">
                                {driver.taxis.map(taxi => (
                                    <div key={taxi.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-800">{taxi.plateNumber}</p>
                                            <p className="text-xs text-gray-500">{taxi.model}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${taxi.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                                    taxi.status === 'BUSY' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {taxi.status}
                                            </span>
                                            <Link href={`/admin/taxis/${taxi.id}`} className="text-blue-600 text-sm hover:underline">
                                                Voir
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Aucun véhicule assigné à ce chauffeur.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar / Stats (Optional placeholder) */}
                <div className="space-y-6">
                    <div className="bg-green-800 text-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-2">Statut du Compte</h3>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-bold">ACTIF</span>
                        </div>
                        <p className="text-sm opacity-80">
                            Ce chauffeur est autorisé à exercer. Dernière connexion : {new Date(driver.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
