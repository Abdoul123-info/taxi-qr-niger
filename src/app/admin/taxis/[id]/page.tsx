import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode'; // Server-side QR generation
import Link from 'next/link';
import AssignDriverButton from '@/components/admin/AssignDriverButton';
export const dynamic = 'force-dynamic';

export default async function TaxiDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const taxi = await prisma.taxi.findUnique({
        where: { id },
        include: { driver: true, incidents: true, lostItems: true }
    });

    const drivers = await prisma.driver.findMany(); // Fetch all drivers for assignment

    if (!taxi) {
        return <div className="p-8 text-center text-red-500 font-bold">Taxi introuvable</div>;
    }

    // Generate QR Code Data URL server-side
    // Pointing to the public URL (assuming localhost:3000 for dev)
    const publicUrl = `http://localhost:3000/taxi/${taxi.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, { width: 300, margin: 2 });

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/taxis" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <span className="mr-1">←</span> Retour à la liste
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                            <span className="bg-green-100 p-2 rounded-full mr-3 text-green-600">🚕</span>
                            Détails du Taxi
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Portière</label>
                                <p className="text-xl font-extrabold text-green-900">{taxi.doorNumber || "---"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Immatriculation</label>
                                <p className="text-lg font-medium text-gray-900">{taxi.plateNumber}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Compagnie</label>
                                <p className="text-lg font-medium text-gray-900">{taxi.company || "Indépendant"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Modèle</label>
                                <p className="text-lg font-medium text-gray-900">{taxi.model}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Statut Actuel</label>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${taxi.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                        taxi.status === 'MAINTENANCE' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {taxi.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chauffeur Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                            <span className="bg-orange-100 p-2 rounded-full mr-3 text-orange-600">👤</span>
                            Chauffeur Assigné
                        </h2>
                        {taxi.driver ? (
                            <div>
                                <p className="font-bold">{taxi.driver.name}</p>
                                <p className="text-gray-500">{taxi.driver.phone}</p>
                                <p className="text-xs text-gray-400 mt-1">Permis: {taxi.driver.licenseNumber || "---"}</p>
                            </div>
                        ) : (
                            <AssignDriverButton taxiId={taxi.id} drivers={drivers} />
                        )}
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Code QR Unique</h3>
                        <div className="bg-white p-2 inline-block border border-gray-100 rounded-lg shadow-inner mb-4">
                            <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
                        </div>
                        <p className="text-xs text-gray-400 mb-4 break-all px-4">{taxi.id}</p>

                        <div className="flex flex-col space-y-2">
                            <a
                                href={qrCodeDataUrl}
                                download={`taxi-${taxi.plateNumber}-qr.png`}
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-bold transition w-full"
                            >
                                Télécharger l'Image
                            </a>
                            <Link
                                href={`/taxi/${taxi.id}`}
                                target="_blank"
                                className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-4 rounded font-bold transition w-full"
                            >
                                Simuler le Scan (Web)
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
