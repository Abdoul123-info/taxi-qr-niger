import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode'; // Server-side QR generation
import Link from 'next/link';
import AssignDriverButton from '@/components/admin/AssignDriverButton';
import TaxiQRSection from '@/components/admin/TaxiQRSection';

export const dynamic = 'force-dynamic';

export default async function TaxiDetailPage({ params }: { params: any }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!id) {
            return <div className="p-8 text-center text-red-500 font-bold">ID du taxi manquant dans l'URL</div>;
        }

        const taxi = await prisma.taxi.findUnique({
            where: { id },
            include: { driver: true, incidents: true, lostItems: true }
        });

        const drivers = await prisma.driver.findMany(); // Fetch all drivers for assignment

        if (!taxi) {
            return <div className="p-8 text-center text-red-500 font-bold">Taxi introuvable (#{id})</div>;
        }

        // Generate QR Code Data URL server-side
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taxi-qr-niger.vercel.app';
        const publicUrl = `${baseUrl}/taxi/${taxi.id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
            width: 600,
            margin: 2,
            errorCorrectionLevel: 'L' // Low error correction = larger blocks = better for distance
        });

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
                                <AssignDriverButton
                                    taxiId={taxi.id}
                                    drivers={drivers.map(d => ({ id: d.id, name: d.name }))}
                                />
                            )}
                        </div>
                    </div>

                    {/* QR Code Section (Client Component) */}
                    <div className="space-y-6">
                        <TaxiQRSection
                            taxi={{
                                id: taxi.id,
                                plateNumber: taxi.plateNumber,
                                doorNumber: taxi.doorNumber
                            }}
                            qrCodeDataUrl={qrCodeDataUrl}
                        />
                    </div>

                </div>
            </div>
        );
    } catch (error: any) {
        console.error("TaxiDetailPage Error:", error);
        return (
            <div className="p-8 text-center border-2 border-red-200 rounded-xl bg-red-50">
                <h1 className="text-xl font-bold text-red-700 mb-2">Une erreur est survenue</h1>
                <p className="text-gray-600 mb-4">{error.message || "Erreur de chargement des données"}</p>
                <Link href="/admin/taxis" className="text-blue-600 underline">Retour à la liste</Link>
            </div>
        );
    }
}
