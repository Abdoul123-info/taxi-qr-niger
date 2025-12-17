import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PublicTaxiProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const taxi = await prisma.taxi.findUnique({
        where: { id },
        include: { driver: true }
    });

    if (!taxi) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h1 className="text-4xl mb-4">🚕❓</h1>
                    <p className="text-xl font-bold text-gray-800">Taxi Non Identifié</p>
                    <p className="text-gray-500">Ce code QR ne correspond à aucun véhicule enregistré.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">

            {/* Header Mobile Style */}
            <div className="bg-green-700 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative z-0">
                <div className="flex justify-between items-center mb-4">
                    <Link href="/" className="text-white/80 hover:text-white flex items-center text-xs font-bold uppercase tracking-widest">
                        <span className="mr-2">←</span> Retour
                    </Link>
                    <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                        Scan Vérifié
                    </div>
                </div>
                <div className="text-center mt-2">
                    <div className="inline-block p-1 bg-white rounded-full mb-3 shadow-md">
                        <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {taxi.driver?.photoUrl ? (
                                <img src={taxi.driver.photoUrl} alt="Chauffeur" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">👤</span>
                            )}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">{taxi.driver?.name || "Chauffeur Non Assigné"}</h1>
                    <p className="text-green-100 text-sm">Chauffeur Agréé</p>
                </div>
            </div>

            {/* Content Card - Overlap */}
            <div className="px-4 -mt-8 relative z-10">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                    {/* Vehicle Info */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">Portière</p>
                            <p className="text-2xl font-extrabold text-green-900">{taxi.doorNumber || "---"}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">Plaque</p>
                            <p className="text-lg font-bold text-gray-900">{taxi.plateNumber}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">Véhicule</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{taxi.model}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-400 uppercase">Compagnie</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{taxi.company || "Indépendant"}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center space-x-3">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-bold text-green-800 text-sm">Statut Officiel</span>
                        </div>
                        <span className="font-bold text-green-900">{taxi.status}</span>
                    </div>

                    {/* Action Buttons (Passenger Extensions) */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Signalements & Sécurité</h3>

                        <Link
                            href={`/taxi/${taxi.id}/incident`}
                            className="flex items-center justify-center w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition border border-red-100"
                        >
                            <span className="mr-2">🚨</span> Signaler un Incident
                        </Link>

                        <Link
                            href={`/taxi/${taxi.id}/lost-item`}
                            className="flex items-center justify-center w-full py-4 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl font-bold transition border border-orange-100"
                        >
                            <span className="mr-2">🎒</span> Objet Perdu ?
                        </Link>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8 text-gray-400 text-xs">
                <p>Système d'Identification Nationale</p>
                <p className="mt-1">Niger 🇳🇪</p>
            </div>

        </div>
    );
}
